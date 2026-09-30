# Mikä on Kubernetesin Gateway API suhteessa vanhaan Ingress-resurssiin?

## Ratkaisu

Ingressin rajoitukset (vain perus-HTTP, toteutuskohtaiset annotaatiot) johtivat Gateway API:in, joka on GA vuodesta 2023. Suosittu ingress-nginx-ohjain on lisäksi siirtynyt pois aktiivisesta ylläpidosta, mikä on vauhdittanut siirtymiä.

## Käytännössä

Suunnittele siirtymä kontrollerin tuen mukaan (Envoy Gateway, Cilium, Istio, NGINX Gateway Fabric) ja muunna Ingressit HTTPRouteiksi esim. ingress2gateway-työkalulla.


[Lue lisää](https://gateway-api.sigs.k8s.io/)
