self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: 'path/to/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.head, options)
  );
});
