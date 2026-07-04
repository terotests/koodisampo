# Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten määrität volume?

**Ratkaisu:** NFS volume driver:

```yaml
volumes:
  appdata:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs.server,rw
      device: ":/export/path"
```

Mount serviceen: `volumes: ["appdata:/data"]`.
