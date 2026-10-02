# Modello ER e scelte di simulazione

ER è una simulazione didattica. BPC è un indice di gioco fra 0 e 100, non una
misura validata di perfusione cerebrale. La soglia di arresto a 40, i delta delle
patologie, i benefici delle cure e le penalità restano convenzioni di gioco.

## Regole rese coerenti

- Una cura fornisce il beneficio numerico solo quando è presente la condizione
  richiesta dai dati. L’adrenalina mantiene la condizione libera del gioco.
- Il beneficio totale è limitato a 100 **prima** delle penalità: una riserva
  numerica non può nascondere un effetto avverso.
- La trasfusione senza emorragia non dà un bonus e applica la penalità di 25:
  a riposo il risultato è 75, con avviso di sovraccarico simulato.
- Lo stress da adrenalina con sforzo o trombolisi resta una regola esplicita del
  gioco; non rappresenta una controindicazione clinica universale.
- Emorragia con BPC fra 60 e 80: tachicardia illustrativa a 120 BPM, non la
  precedente bradicardia automatica. Infarto non implica automaticamente
  fibrillazione ventricolare: il modello mostra una tachicardia illustrativa.
- Scenari/cure ripetuti non raddoppiano gli effetti; identificatori sconosciuti
  sono ignorati. I dati originali non vengono modificati.

## Dettagli locali

Le pressioni e le saturazioni anatomiche sono mostrate come riferimenti a riposo.
Quando lo stato cambia, vengono sostituite da indicazioni qualitative di
perfusione e apporto di ossigeno. Non viene inventata una conversione lineare
del BPC in mmHg o saturazione. Embolia e infarto hanno descrizioni locali
specifiche; la trombolisi attenua il quadro dell’embolia nel modello.
Un BPC compensato non fa scomparire una patologia ancora selezionata.
In arresto l’apporto è assente: non si afferma che la saturazione diventi zero.

## ECG e audio

Onda illustrativa, lampeggio e beep condividono il tempo trascorso e i BPM
prodotti dallo stato sistemico. La frequenza non dipende dal numero di frame.
Il suono viene attivato esplicitamente, può essere silenziato e viene ripulito
alla chiusura del componente. In background non vengono recuperati i battiti
persi e l’allarme continuo viene fermato. Resta la normale tolleranza di
scheduling del browser: questo non è un monitor medico in tempo reale.

## Fonti qualitative consultate

- [MSD: Shock](https://www.msdmanuals.com/professional/critical-care-medicine/shock-and-fluid-resuscitation/shock): ipoperfusione, meccanismi e tachicardia tipica.
- [Merck: Fluid resuscitation](https://www.merckmanuals.com/professional/critical-care-medicine/shock-and-fluid-resuscitation/intravenous-fluid-resuscitation): rischio di sovraccarico con somministrazione di volume.

Le fonti supportano le direzioni qualitative, non i valori numerici scelti nel gioco.
