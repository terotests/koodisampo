# Haluat julkaista HTTP-palvelun portissa 8080 mDNS:llä. Mihin konfiguraatio kuuluu?

**Ratkaisu:** Avahi service -tiedosto `/etc/avahi/services/*.service`:

```xml
<service-group>
  <name>My App</name>
  <service>
    <type>_http._tcp</type>
    <port>8080</port>
  </service>
</service-group>
```

Avahi ilmoittaa palvelun verkossa `_http._tcp.local`.
