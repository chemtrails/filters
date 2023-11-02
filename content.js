let host = new URL(location.href).hostname
let brightness = '100'
let contrast = '100'
let saturation = '100'
let sepia = '0'

chrome.storage.local.get([host, 'global']).then(res => {

    if (res[host]) {
        brightness = res[host].brightness
        contrast = res[host].contrast
        saturation = res[host].saturation
        sepia = res[host].sepia
    } else if (res.global) {
        brightness = res.global.brightness
        contrast = res.global.contrast
        saturation = res.global.saturation
        sepia = res.global.sepia
    } else {
        return
    }

    setFilter()
    updateInputs()
})

let code = `
<div id="__main_container__">
<div id="__buttons_container__">
    <div id="__close_btn__" title="Close"><div></div></div>
    <div id="__reset_btn__" title="Reset"><svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="white" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0 1 1 0 2.5 2.5)" stroke-width="1.5"><path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/><path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/></g></svg></div>
    <div id="__glob_btn__" title="Apply to all websites"><svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="white" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)" stroke-width="1.5"><path d="m8 16c4.4380025 0 8-3.5262833 8-7.96428571 0-4.43800246-3.5619975-8.03571429-8-8.03571429-4.43800245 0-8 3.59771183-8 8.03571429 0 4.43800241 3.56199755 7.96428571 8 7.96428571z"/><path d="m1 5h14"/><path d="m1 11h14"/><path d="m8 16c2.2190012 0 4-3.5262833 4-7.96428571 0-4.43800246-1.7809988-8.03571429-4-8.03571429-2.21900123 0-4 3.59771183-4 8.03571429 0 4.43800241 1.78099877 7.96428571 4 7.96428571z"/></g></svg></div>
</div>
<div class="__input_container__">
    <div>Brightness</div>
    <input name="brightness" type="range" min="0" max="200" value="100">
</div>
<div class="__input_container__">
    <div>Contrast</div>
    <input name="contrast" type="range" min="0" max="200" value="100">
</div>
<div class="__input_container__">
    <div>Saturation</div>
    <input name="saturation" type="range" min="0" max="200" value="100">
</div>
<div class="__input_container__">
    <div>Warmth</div>
    <input name="sepia" type="range" min="0" max="100" value="0">
</div>
</div>
`

document.body.insertAdjacentHTML('beforeend', code)

const container = document.getElementById('__main_container__')

chrome.runtime.onMessage.addListener(showContainer);

document.addEventListener('click', e => {
    if (e.target.closest('#__main_container__') === null) hideContainer();
})

const contrastInput = container.querySelector('input[name=contrast]')
const brightnessInput = container.querySelector('input[name=brightness]')
const saturationInput = container.querySelector('input[name=saturation]')
const sepiaInput = container.querySelector('input[name=sepia]')

const closeBtn = container.querySelector('#__close_btn__')
const globBtn = container.querySelector('#__glob_btn__')
const resetBtn = container.querySelector('#__reset_btn__')

contrastInput.oninput = () => {
    contrast = contrastInput.value < 20 ? 20 : contrastInput.value
    setFilter()
}

brightnessInput.oninput = () => {
    brightness = brightnessInput.value < 20 ? 20 : brightnessInput.value
    setFilter()
}

saturationInput.oninput = () => {
    saturation = saturationInput.value
    setFilter()
}

sepiaInput.oninput = () => {
    sepia = sepiaInput.value
    setFilter()
}

contrastInput.addEventListener('change', save)
brightnessInput.addEventListener('change', save)
saturationInput.addEventListener('change', save)
sepiaInput.addEventListener('change', save)

closeBtn.addEventListener('click', hideContainer)
globBtn.addEventListener('click', setGlobalLevels)
resetBtn.addEventListener('click', reset)

function save() {
    host = new URL(location.href).hostname

    if (brightness === '100' && contrast === '100' && saturation === '100') {
        chrome.storage.local.remove(host)
    } else {
        let obj = {}

        obj[host] = {
            brightness: brightness,
            contrast: contrast,
            saturation: saturation,
            sepia: sepia
        }

        chrome.storage.local.set(obj)
    }
}

function setFilter() {
    document.documentElement.style = `filter: contrast(${contrast}%) brightness(${brightness}%) saturate(${saturation}%) sepia(${sepia}%) !important`
}

function updateInputs() {
    saturationInput.value = saturation
    brightnessInput.value = brightness
    contrastInput.value = contrast
    sepiaInput.value = sepia
}

function showContainer() {
    container.style.display = 'flex'
}

function hideContainer() {
    container.style.display = 'none'
}

function setGlobalLevels() {
    chrome.storage.local.set({
        global: {
            brightness: brightness,
            contrast: contrast,
            saturation: saturation,
            sepia: sepia
        }
    });
}

function reset() {
    brightness = '100'
    contrast = '100'
    saturation = '100'
    sepia = '0'
    setFilter()
    updateInputs()
    save()
}