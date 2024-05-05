export const applyExerciseComponentStyling = () => {

const infinitiveWord = document.getElementById('infinitive-word')
const asideButtonsContainer = document.getElementById('aside-buttons-container')
const asideButtonsContainerRect = asideButtonsContainer.getBoundingClientRect()

const infinitiveWordRect = infinitiveWord.getBoundingClientRect()

asideButtonsContainer.style.left = `${infinitiveWordRect.left - asideButtonsContainerRect.width - 10}px`

   window.addEventListener('resize', () => {
      const infinitiveWordRect = infinitiveWord.getBoundingClientRect()
      asideButtonsContainer.style.left = `${infinitiveWordRect.left - asideButtonsContainerRect.width - 10}px`
   })

}

export const applyExerciseComponentCorrectionStepStyling = () => {
   applyExerciseComponentStyling()

   const placeButtonOnCenterOfInput = (inputId, buttonId) => {

      const input = document.getElementById(inputId)
      const button = document.getElementById(buttonId)
      
      const inputRect = input.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      
      const padding = (inputRect.height - buttonRect.height) / 2
      
      button.style.top = `${inputRect.top + padding}px`
      button.style.left = `${inputRect.x + padding}px`
      
      
   }
   
   placeButtonOnCenterOfInput('participle-correction', 'participle-audio')
   placeButtonOnCenterOfInput('simple-past-correction', 'simple-past-audio')
   window.addEventListener('resize', () => {
      placeButtonOnCenterOfInput('participle-correction', 'participle-audio')
      placeButtonOnCenterOfInput('simple-past-correction', 'simple-past-audio')
   })
}
