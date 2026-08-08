# Mitä tarkoittaa integer ambiguity resolution RTK:ssa?

## Tilanne

Vastaanotin näyttää 'FLOAT' eikä 'FIXED'. Mitä puuttuu?

## Ratkaisu

Kantoaalto mittaa vain faasin murto-osan + tuntemattoman kokonaisluvun N (ambiguity). **Integer ambiguity resolution** kiinnittää N:n. Onnistuessaan tila on FIXED (cm); FLOAT jättää N:n reaalisena (dm). Cycle slip nollaa työn.

## Käytännössä

Paranna edellytyksiä: lyhyt baseline, dual-frequency, monikonstellaatio, avoin taivas, hyvä antenni. Älä luota FLOAT-tilaan rajapyykille.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Integer_Ambiguity_Resolution)
