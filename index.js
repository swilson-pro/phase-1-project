
const baseUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json?'
const maybelline = 'brand=maybelline'
const imageCountDefault = 5;
const productMenu = document.querySelector('#product-menu');
let fiveItems = [];
let cleanData = [];
const productForm = document.querySelector('#new-product');
const numImages = 5

const stila = 'brand=stila' // no products
const coverGirl = 'brand=covergirl'
const revlon = 'brand=revlon'
const wetNWild = 'brand=wetnwild' // only 4 products

// put a try and catch in for good coding practice

// dropdown menu select & options
const select = document.querySelector('select')
console.log('select.options', select.options)
const option = select.options[select.selectedIndex]
console.log('select.options[select.selectedIndex]', select.options[select.selectedIndex])
const value = select.options[select.selectedIndex].value;
console.log('value', value);
const text = select.options[select.selectedIndex].text;
console.log('text', text);

console.log('header.textContent', header.textContent);

const companies = document.querySelector("#company-selector");

postImages(maybelline)

select.addEventListener('change', function() {
    console.log('you selected: ', this.value);
    console.log('you selected: ', this.text);
    // this.text is undefined. how to get the selected value of the option?
    const header = document.querySelector('#header');
    header.textContent = select.options[select.selectedIndex].text;
    console.log('typeof(select.options[select.selectedIndex].value', typeof(select.options[select.selectedIndex].value))
    console.log('select.options[select.selectedIndex].value', select.options[select.selectedIndex].value);
    // postImages(select.options[select.selectedIndex].value) // if you change to cover girl, this is covergirl.
    // postImages(coverGirl)
    postImages(`brand=${select.options[select.selectedIndex].value}`)

})

async function dataRequest(brand) {
        let req = await fetch(baseUrl + brand)
        let res = await req.json()
        console.log('res', res);
        return res
}

console.log('dataRequest(coverGirl)',dataRequest(coverGirl))

async function getFive(dataObject) {
    cleanData = [];
    let data = await dataObject
    //console.log('data', data)
    //    data.forEach(element => console.log(element.rating))
    data.forEach(nullRemove)                

    function nullRemove(element) {
        //console.log(element.image_link);
        if (element) {
            if (element.hasOwnProperty('image_link') && element.image_link !== null){
            // if (element.image_link !== null || element !== undefined) {
                cleanData.push(element)
            }
        }
        return cleanData;
    }
console.log('cleanData', cleanData);

// cleanData.forEach((element) => {console.log(element.image_link)})

//can i put a while loop in here, where i say while the fiveItems array
// does not conain the randItem, push the randItem onto the fiveItems 
// array? 

fiveItems = [];

    for (let i = 0; i < numImages; i++) {
        // console.log('i: ', i);

        // divide the array into 5 piece and randomly pick from those peices. 
        const length = cleanData.length/numImages;
        let min = i*length;
        let max = (i + 1)*length;
        //let randNum = Math.floor(Math.random() * cleanData.length);

        let randNum = Math.floor(Math.random() * (max - min) + min)

        // also could have shuffled the array, and then chosen the first 5. that
        // wouldn't necesitate a loop?
        // or i could splice it (or slice it?)

        // console.log('randItem.price: ', randItem.price);
        console.log('randNum', randNum);
        fiveItems.push(cleanData[randNum]);

    }
    // console.log('fiveItems_2', fiveItems)
    // fiveItems.forEach(appendImages)

    return fiveItems
    // console.log('fiveItems inside getFive()', fiveItems)
}

async function postImages(brand) {
    productMenu.innerHTML = "";
    const fiveItems = await getFive(dataRequest(brand))
    console.log('fiveItems inside postImages', fiveItems);
    fiveItems.forEach(element => appendImages(element))
}

 // console.log('getFive', getFive)
// console.log('fiveItems_1', fiveItems);
// fiveItems.forEach(appendImages)

async function appendImages(arrayItem) {
    console.log('arrayItem', arrayItem);
    const img = document.createElement('img')
    const imageLink = await arrayItem.image_link;
    img.src = imageLink;
    console.log('arrayItem.image_link', arrayItem.image_link)
    console.log('img', img);
    img.details = arrayItem;
    const button = document.createElement('button');
    // button.type = 'button';
    button.innerHTML = 'X'
    // console.log(button);
    img.addEventListener('click', updateProductDetails);
    button.addEventListener('click', () => {
        button.remove();
        img.remove();
    });

    const div = document.createElement('div');
    productMenu.append(div);

    img.classList.add('menu-img');
    button.classList.add('btn', 'hidden');
    productMenu.classList.add('product-menu');
    img.addEventListener('mouseover', () => {button.classList.remove('hidden')})
    img.addEventListener('mouseleave', () => {button.classList.add('hidden')})
    button.addEventListener('mouseover', () => {button.classList.remove('hidden')})
    button.addEventListener('mouseleave', () => {button.classList.add('hidden')})


    div.append(img);
    div.append(button);

    // productMenu.append(img);
    // productMenu.append(button);
}

function updateProductDetails(event){
    let arrayItem = event.target.details;
    // console.log('arrayItem.name', arrayItem.name);
    console.log('event: ', event);
    console.log('event.target: ', event.target);
    console.log('event.target.details: ', event.target.details);
    // console.log('arrayItem.name: ', arrayItem.name);
    const name = document.querySelector('.name');
    name.textContent = arrayItem.name;
    // console.log(name);
    const image = document.querySelector('.detail-image');
    image.src = arrayItem.image_link;
    const price = document.querySelector('.price');
    price.textContent = "$" + arrayItem.price;
    const rating = document.querySelector('#rating-display');
    rating.textContent = arrayItem.rating;
    const description = document.querySelector('#des-Display');
    description.textContent = arrayItem.description;
}

productForm.addEventListener('submit', createItem);

function createItem(event) {
    event.preventDefault();
    // console.log('test submission');
   
    const name = document.querySelector('#new-name').value;
    console.log('name: ', name);
    const price = document.querySelector('#new-price').value;
    const image_link = document.querySelector('#new-image').value;
    const rating = document.querySelector('#new-rating').value;
    const description = document.querySelector('#new-des').value;

    const item = {name: name, price: price, image_link: image_link, rating: rating, description: description}

    console.log('Item: ', item);
    
    appendImages(item);

    productForm.reset();

}
