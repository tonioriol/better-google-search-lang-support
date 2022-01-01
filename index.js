// ==UserScript==
// @name Better Google Search Language Support
// @description:en Add language filter in Google search for each language defined in langList var.
// @version 3.0.0
// @grant none
// @include *.google.*
// ==/UserScript==
(function () {
  const langList = ['ca', 'es', 'en', 'sv']
  const url = new URL(location.href)

  const menu = document.createElement('div')
  menu.style.position = 'absolute'
  menu.style.top = '0'
  menu.style.left = '0'
  menu.style.right = '0'
  menu.style.zIndex = '9999999999'
  menu.style.display = 'flex'
  menu.style.flexDirection = 'row'
  menu.style.gap = '1rem'
  menu.style.justifyContent = 'center'

  langList.forEach(l => {
    const item = document.createElement('div')
    url.searchParams.set('lr', `lang_${l}`)
    item.innerHTML = `<a href="${url}">${l}</a>`
    menu.appendChild(item)
  })

  document.querySelector('body').appendChild(menu)
})()
