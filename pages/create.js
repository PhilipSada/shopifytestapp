import React, {useState, useCallback} from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { Page, PageActions,FormLayout, TextField, Select, DisplayText, CalloutCard, 
    Card, EmptyState, ColorPicker, Layout, hsbToRgb, Toast, Frame, Link as PLink} from '@shopify/polaris';
import store from 'store-js';
import ProductInfo from '../components/ProductInfo';
import axios from 'axios';


export default function CreatePage() {

  const [state, setState] = useState({
    modalOpen: false
  })
  const [formState, setFormState] = useState({
    title:'',
    percentage:'0'
  })
  
  function handleText(name, text, id){
        let newState = {
            [name]:text
        }
        setFormState({
            ...formState,
            ...newState
        })
  }
  
  const [textColor, setTextColor] = useState({
      color:{
        hue: 120,
        brightness: 1,
        saturation: 0,
      },
      rgbColor:{
          red:255,
          green:255,
          blue:255,
      }
    
  });
  
//   const handleTextColor = useCallback(setTextColor, []);

  function handleTextColor(color){
        
    console.log(color)
    //to make the color to rgb
     let newRgbColor = hsbToRgb(color);
     let newState = {
        color: color,
        rgbColor: newRgbColor
     }
     setTextColor(newState)
  }
  const [bgColor, setBgColor] = useState({
      color:{
        hue: 0,
        brightness: 0,
        saturation: 0,
      },
      rgbColor:{
          red:0,
          green:0,
          blue:0,
      }
    
  });
  
//   const handleTextColor = useCallback(setTextColor, []);

  function handleBgColor(color){
        
    console.log(color)
    //to make the color to rgb
     let newRgbColor = hsbToRgb(color);
     let newState = {
        color: color,
        rgbColor: newRgbColor
     }
     setBgColor(newState)
  }
  const [bannerLocation, setBannerLocation] = useState('top');

  const handleBannerLocation = useCallback((value) => setBannerLocation(value), []);
  const bannerLocationOptions = [
    {label: 'Top Of Page', value: 'top'},
    {label: 'Bottom Of Page', value: 'bottom'},
    {label: 'Custom', value: 'custom'},
  ];

  const [productInfoState, setProductInfoState] = useState({
    id:'',
    title:'',
    image_url:'',
    description:'',
  });

  function showCustomCode(){
    return(
      <div>
           <p> Copy this code below to place the sale banner where you want</p>
           {/* to display the code for users to copy in shopify you will need to do html excape so go here "https://www.freeformatter.com/html-escape.html"
           and  copy "<div class="sale-banner-app"></div>" there */}
           <textarea>
             &lt;div class=&quot;sale-banner-app&quot;&gt;&lt;/div&gt;
          </textarea>
      </div>
     
    )
  }

  const [toastActive, setToastActive] = useState(false);
  const toggleToastActive = () => setToastActive((toastActive) => !toastActive);
  const toastMarkup = toastActive ? (
    <Toast content="The sale banner has been saved" onDismiss={toggleToastActive} />
  ) : null;
  return (
    <Frame>
    <Page 
     breadcrumbs={[{content: 'Home', url: '/'}]}
     title="Create a Sales Banner"> 
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      

     <Layout>
     <Layout.AnnotatedSection
        title="Banner Information"
        description="Create a name for your banner."
      >
        <Card sectioned>
        <FormLayout>
            <TextField type="text" label="Title" onChange={(text, id) => handleText('title', text, id)} value={formState.title} />
            <TextField type="text" label="Sale Percentage" onChange={(text, id) => handleText('percentage', text, id)} value={formState.percentage} />
            <div>
                <div className="Polaris-Label"><label id="Polaris-ColorPickerLabel" htmlFor="Polaris-ColorPicker" className="Polaris-Label__Text">Text Color</label></div>
                
                <div style={{
                    display: 'flex'

                }}> 
                    <ColorPicker onChange={handleTextColor} color={textColor.color} />
                    <div style={{
                        padding:'0 10px 0 10px'
                    }}>
                        <div className="Polaris-Label"><label id="Polaris-ColorPickerLabel" htmlFor="Polaris-ColorPicker" className="Polaris-Label__Text">Selected Text Color</label></div>
                        <div style={{
                        width:'100px',
                        height: '40px',
                        backgroundColor:`rgba(${textColor.rgbColor.red}, ${textColor.rgbColor.green},${textColor.rgbColor.blue})`,
                        }}>
                            
                        </div>

                    </div>
                    
                </div>
            </div>
            <div>
                <div className="Polaris-Label"><label id="Polaris-ColorPickerLabel" htmlFor="Polaris-ColorPicker" className="Polaris-Label__Text">Background Color</label></div>
                
                <div style={{
                    display: 'flex'

                }}> 
                    <ColorPicker onChange={handleBgColor} color={bgColor.color} />
                    <div style={{
                        padding:'0 10px 0 10px'
                    }}>
                        <div className="Polaris-Label"><label id="Polaris-ColorPickerLabel" htmlFor="Polaris-ColorPicker" className="Polaris-Label__Text">Selected Background Color</label></div>
                        <div style={{
                        width:'100px',
                        height: '40px',
                        backgroundColor:`rgba(${bgColor.rgbColor.red}, ${bgColor.rgbColor.green},${bgColor.rgbColor.blue})`,
                        }}>
                            
                        </div>

                    </div>
                    
                </div>
            </div>
           
            
        </FormLayout>
        </Card>
    </Layout.AnnotatedSection>
    <ProductInfo setProductInfoState={setProductInfoState}/>
    <Layout.AnnotatedSection
        title="Banner Location"
        description="Choose a location on your site where your banner would appear."
      >
        <Card sectioned>
     
          <Select
            label="Location"
            options={bannerLocationOptions}
            onChange={handleBannerLocation}
            value={bannerLocation}
          />
         {bannerLocation == 'custom' ? showCustomCode() : ''}
        </Card>
    </Layout.AnnotatedSection>
    <Layout.Section>
    <Card title="Banner Preview" sectioned>
      <div style={{
         width:'100%',
         display:'flex',
      }}>
        <div style={{
          maxWidth:'1200px',
          width:'100%',
          display:'flex',
          padding:'40px 20px',
          backgroundColor:`rgba(${bgColor.rgbColor.red}, ${bgColor.rgbColor.green},${bgColor.rgbColor.blue})`
        }}>
           <div style={{width:'200px',display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', flexGrow:1}}>
              <img style={{width:'200px'}} src={`${productInfoState.id == 'empty' ? "https://cdn.shopify.com/s/files/1/0420/0369/3721/products/8072c8b5718306d4be25aac21836ce16.jpg?v=1599853395": productInfoState.image_url}`}/>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:'100%'}}>
                <h2 style={{
                  fontSize:'3rem', 
                  marginBottom:'5.5rem', 
                  fontWeight:'700',
                  color:`rgba(${textColor.rgbColor.red}, ${textColor.rgbColor.green},${textColor.rgbColor.blue})
                `}}>
                    {formState.title}
                </h2>
                <span style={{fontSize:'10rem', color:`rgba(${textColor.rgbColor.red}, ${textColor.rgbColor.green},${textColor.rgbColor.blue})
                `}}> {formState.percentage}%</span>
              </div>
            </div>
        </div>
          
      </div>
    </Card>
    {toastMarkup}
    </Layout.Section>
    </Layout>
    <PageActions
        primaryAction={{
            content: 'Save',
            onAction: ()=>{
              const savedData = {
                title: formState.title,
                percentage: formState.percentage,
                textColor: textColor.rgbColor,
                bgColor: bgColor.rgbColor,
                bannerLocation: bannerLocation,
                productInfo: productInfoState
              }
              console.log(savedData);
              axios.post('/api/banners', savedData)
              .then(function (response) {
                console.log(response);
                toggleToastActive()
              })
              .catch(function (error) {
                console.log(error);
              });
            }
        }}
       secondaryActions={[
            {
            content: 'Delete',
            destructive: true,
            },
        ]}
        />
  </Page>
  </Frame>
  )
}