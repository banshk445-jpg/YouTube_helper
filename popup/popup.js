const t = (key) => chrome.i18n.getMessage(key);

document.getElementById('popup-title').textContent = t('extName');
document.getElementById('header-title').textContent = t('extName');
document.getElementById('header-subtitle').textContent = t('popupSubtitle');
document.getElementById('status-badge-text').textContent = t('popupStatusBadge');
document.getElementById('steps-title').textContent = t('popupStepsTitle');
document.getElementById('step-1').innerHTML = t('popupStep1');
document.getElementById('step-2').innerHTML = t('popupStep2');
document.getElementById('step-3').innerHTML = t('popupStep3');
document.getElementById('feature-1').textContent = t('popupFeature1');
document.getElementById('feature-2').textContent = t('popupFeature2');
document.getElementById('feature-3').textContent = t('popupFeature3');
document.getElementById('feature-4').textContent = t('popupFeature4');
document.getElementById('footer-text').textContent = t('popupFooter');
