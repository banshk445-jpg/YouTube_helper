document.addEventListener('DOMContentLoaded', async () => {
  const { apiKey } = await chrome.storage.local.get('apiKey');
  if (apiKey) document.getElementById('api-key').value = apiKey;

  document.getElementById('save-btn').addEventListener('click', async () => {
    const key = document.getElementById('api-key').value.trim();
    await chrome.storage.local.set({ apiKey: key });

    const status = document.getElementById('status');
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 2500);
  });
});
