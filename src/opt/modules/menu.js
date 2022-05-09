const menuContainer = document.querySelector('.main-nav')
const menuButton = menuContainer.querySelector('.main-nav__btn')

const init = ()=>{
    
}
const menuToggle = (state)=>{
    if(state == true || menuContainer.classList.contains('menu-closed')){
        menuContainer.classList.remove('menu-closed')
        menuContainer.classList.add('menu-open')
    }else if(state == false || menuContainer.classList.contains('menu-open')){
        menuContainer.classList.remove('menu-open')
        menuContainer.classList.add('menu-closed')
    }
}

menuButton.addEventListener('click',menuToggle)

export { init,menuToggle }