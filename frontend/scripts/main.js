import { initIntroExperience } from'./introExperience.js';
import { initFloatingMenu } from './floatingMenu.js';
import { initCountdown } from './countdown.js';
import { initGalleryModal } from './gallery.js';
import { initModal } from './modal.js';
import { initDynamicFields } from './dynamicFields.js';
import { initSubmitForm } from './submitForm.js';

document.addEventListener("DOMContentLoaded", () => {
    initIntroExperience();
    initCountdown();
    initGalleryModal();
    initModal();
    initDynamicFields();
    initSubmitForm();
    initFloatingMenu();
});