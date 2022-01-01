// ==UserScript==
// @name Better Google Search Language Support
// @description:en Add language filter in Google search for each language defined in google search settings.
// Takes the languages you have configured in your Google search settings and adds them as separate items
// for each instead of adding just one filter for all defined languages.
// @version 2.0.1
// @grant none
// @include *.google.*
// ==/UserScript==
(function () {
  function addNewLangFilters() {
    const query = new URLSearchParams(location.search).get('q')

    const langMenuItems = [...document.getElementsByTagName('g-menu')].find(x => [...x.children].find(y => y.innerHTML.includes(query))).children
    const locationSearch = langMenuItems[1].firstChild.firstChild.attributes.href.value.replace('/search', '').includes('tbs=lr:lang')
      ? langMenuItems[1].firstChild.firstChild.attributes.href.value.replace('/search', '')
      : location.search
    const search = new URLSearchParams(locationSearch)
    const baseLanguages = search.get('tbs')
    const parsedLanguages = baseLanguages
      .replace('lr:', '')
      .replace('lang_1', 'lang_')
      .split('|')

    // tbs=lr:lang_1ca|lang_1en|lang_1es

    const primaryLang = [...langMenuItems].find(x => x.querySelector('a'))

    const langList = Cookie.remember('google_search_langs', () => parsedLanguages)

    if (!langList) {
      console.log('No languages found')
      return
    }

    // filter already selected language
    const lr = new URLSearchParams(location.search).get('lr')
    const unselectedLangList = langList.filter(ln => ln[0] !== lr)

    unselectedLangList.forEach(l => {
      const newLangMenuItem = primaryLang.cloneNode(true)
      newLangMenuItem.firstChild.firstChild.attributes.href.value = `search?q=${query}&lr=${l}&tbs=${baseLanguages}`
      newLangMenuItem.firstChild.firstChild.innerText = `${l}`
      langMenuItems[1].after(newLangMenuItem)
    })
  }

  setTimeout(addNewLangFilters, 1000)
})()

class Cookie {
  static get(name) {
    const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return value ? JSON.parse(value[2]) : null
  }

  static set(name, value, days = 30) {
    const d = new Date
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = name + '=' + JSON.stringify(value) + ';path=/;expires=' + d.toUTCString()
    return Cookie.get(name)
  }

  static delete(name) {
    Cookie.set(name, '', -1)
  }

  static remember(name, fn, days = 30) {
    return Cookie.get(name) ?? Cookie.set(name, fn(), days)
  }
}
