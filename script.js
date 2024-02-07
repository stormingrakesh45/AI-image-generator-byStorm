const generateForm= document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

let isImageGenerating =false;

const updateImageCard= (imgDataArray) => {

    imgDataArray.forEach((imgObject, index) => {

        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn =imgCard.querySelector(".download-btn");
        

        //set the Image source to the AI- generated Image data
        const aiGeneratedImg=`data:Image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;
//when the image is loaded, remove the loading class and set download attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);



        }

    });
}

const generateAiImages=async (userPrompt, userImgQuantity)=>{

    try{
        //send a request to the open API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`

            },

            body: JSON.stringify({

                prompt:userPrompt,
                n:parseInt(userImgQuantity),
                size:"512x512",
                response_format:"b64_json"


            })
        });

        if(!response.ok) throw new Error("Failed to generate new Images! Please try again.");


        const { data } = await response.json(); //get data from the reponse
        updateImageCard([...data]);
    }catch (error){
        alert(error.message);
    }finally{

        isImageGenerating=false;
    }
}


const handleFormSubmission = (e) =>{

    e.preventDefault();

    if(isImageGenerating) return;
    isImageGenerating=true;

    //get user Input and image quantity values from the form
    const userPrompt =e.srcElement[0].value;
    const userImgQuantity= e.srcElement[1].value;

   //Creating HTML markup for image cards with loading state
    const  imgCardMarkup = Array.from({length:userImgQuantity},()=>

    ` <div class="img-card loading">
    <img src="images/loader.svg" alt="img1">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download-icon">
    </a>
</div>`
    
    ).join("");
    
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);