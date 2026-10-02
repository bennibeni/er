import './globals.css';

export const metadata = {
  title: 'ER · Turno di guardia',
  description: 'Simulatore interattivo del circolo sanguigno con monitor ECG, scenari e interventi.',
};

export default function RootLayout({ children }) {
  return <html lang="it"><body>{children}</body></html>;
}
