import React, {useState, useCallback} from 'react';
import {Avatar, Badge, Page, PageActions,Thumbnail, Heading, MediaCard, TextStyle, FormLayout, TextField, DisplayText, CalloutCard, 
    Card, Button, EmptyState, ColorPicker, Layout, hsbToRgb, Link as PLink} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { gql, useQuery } from '@apollo/client';

const GET_PRODUCTS = gql`
query getProducts($ids: [ID!]!){
    nodes(ids: $ids){
      ... on Product{
        title
        handle
        description
        descriptionHtml
        id
        images(first: 1){
          edges{
            node{
              originalSrc
              altText
              
            }
          }
        }
        variants(first: 1){
          edges{
            node{
              price
              id
            }
          }
        }
      }
    }
  }
`;

export default function ProductInfo(props){
    const [state, setState] = useState({
        modalOpen: false
     })
    const [productChoice, setProductChoice] = useState(false);

    function handleResourcePicker(resources){
        const products = resources.selection.map((product)=>product.id);
        //to store in local storage
        store.set('productIds', products);
        setState({modalOpen:false})
        setProductChoice(true)
      
        const product = resources.selection[0]
        console.log(product)
       //setProductInfoState had to be done to save the product data
          props.setProductInfoState({
                id: product.id,
                title: product.title,
                image_url: product.images[0].originalSrc,
                description: product.descriptionHtml
          })
        console.log(store.get('productIds'))
    }
    const { loading, error, data } = useQuery(GET_PRODUCTS, {
        variables: {
            "ids":store.get('productIds')
        }
    });
    if (loading) return <p>Loading ...</p>;
    // console.log(data)
    // return <h1>Loaded Data Complete!</h1>;
    function showMediaCard(){
        if(productChoice){
            if(loading){
                return (<div>Loading Product...</div>)
            }else{
                const product = {
                    title: data.nodes[0].title,
                    description: data.nodes[0].description,
                    image_url:data.nodes[0].images.edges[0].node.originalSrc
                }
                return (
                    <MediaCard
                    title={product.title}
                    primaryAction={{
                        content: 'Choose another product',
                        onAction: () => setState({modalOpen:true}),
                    }}
                     description={product.description}
                        
                    >
                       <img
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            }}
                            src={product.image_url}
                        />
                    </MediaCard>
                )
            }
        }
       
    }
    

    return (
        <>   
           
            <ResourcePicker 
            resourceType="Product"
            open={state.modalOpen}
            cancel={()=>setState({modalOpen: false})}
            showVariants= {false}
            onSelection={(resources) => handleResourcePicker(resources)}
            />
            <Layout.AnnotatedSection
            title="Product Information"
            description="Create a name for your banner."
           >
            <Card sectioned>
                {!productChoice ? <Button onClick={()=>setState({modalOpen:true})}> Choose A Product</Button>: ''}
                  {showMediaCard()}
            </Card>
            </Layout.AnnotatedSection>
        </>
    )
}