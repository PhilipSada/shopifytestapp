console.log('We are printing from our Print.JS file and i just want to say hello world2');
// let slSettings = {
//     bgColor: {
//       rgbColor: {
//         green: 0,
//         blue: 0,
//         red: 0
//       }
//     },
//     textColor: {
//       rgbColor: {
//         green: 0,
//         blue: 0,
//         red: 255
//       }
//     },
//     title: "July 4 Sale",
//     position: "custom",
//     id: 23423,
//     image_url: 
//       "https://cdn.shopify.com/s/files/1/0438/0187/0496/products/85cc58608bf138a50036bcfe86a3a362.jpg",
//     percentage: 50
//   };

  function runSalesBanner(slSettings){
        let salesBannerHTML = `
        <div style="width: 100%; display: flex; justify-content: center">
            <div style="max-width: 1200px; width: 100%; display: flex; 
            padding: 40px 20px; background: rgba(${slSettings.bgColor.red}, 
            ${slSettings.bgColor.green}, ${slSettings.bgColor.blue})">
            <div style="width: 200px; display: flex; justify-content: center; 
            align-items: center; flex-direction: row; flex-grow: 1;">
                <img style="width: 200px;" src="${slSettings.productInfo.image_url}" />
                <div style="width: 100%; display: flex;justify-content: center; align-items: center; flex-direction: column;">
                <h2 style="font-size: 3rem; margin-bottom: 2.5rem; font-weight: 700; color: rgba(${slSettings.textColor.red}, ${slSettings.textColor.green}, ${slSettings.textColor.blue})">${slSettings.title}</h2>
                <span style="font-size: 6rem; color: rgba(${slSettings.textColor.red}, ${slSettings.textColor.green}, ${slSettings.textColor.blue})">${slSettings.percentage}% OFF</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
    
    if (slSettings.bannerLocation == "top") {
        $("header").after(salesBannerHTML);
    } else if (slSettings.bannerLocation == "bottom") {
        $("footer").before(salesBannerHTML);
    } else {
        $(".sale-banner-app").prepend(salesBannerHTML);
    }
}

$.get( "https://52dc60c0553d.ngrok.io/api/banners", function(data) {
    console.log( "success" );
    console.log(data)
  })
    .done(function(data) {
        runSalesBanner(data.data[0])
    })
    .fail(function() {
        console.log( "error" );
    })
    .always(function() {
        console.log( "finished" );
});
  
  
  