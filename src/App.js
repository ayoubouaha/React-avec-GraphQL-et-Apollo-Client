import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_DATA = gql`
  query {
    allComptes { 
      id 
      solde 
      type 
      dateCreation 
    }
    totalSolde { 
      count 
      sum 
      average 
    }
  }
`;

const CREATE_COMPTE = gql`
  mutation ($solde: Float!, $type: TypeCompte!) {
    saveCompte(compte: { solde: $solde, type: $type }) {
      id 
      solde 
      type
    }
  }
`;

function App() {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');

  const { data, loading, error, refetch } = useQuery(GET_DATA);
  const [createCompte, { loading: creating }] = useMutation(CREATE_COMPTE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!solde) return;
    await createCompte({ 
      variables: { solde: parseFloat(solde), type } 
    });
    setSolde('');
    refetch();
  };

  if (loading) return <p style={{padding: '40px', textAlign: 'center', fontSize: '20px'}}>Chargement des comptes...</p>;
  
  if (error) {
    console.error('GraphQL Error:', error);
    console.error('Error message:', error.message);
    console.error('Network error:', error.networkError);
    console.error('GraphQL errors:', error.graphQLErrors);
    
    return (
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>❌ Erreur de connexion GraphQL</h1>
        
        <div style={{ background: '#ffebee', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ef5350' }}>
          <h3 style={{ marginTop: 0, color: '#c62828' }}>Message d'erreur :</h3>
          <pre style={{ background: '#fff', padding: '15px', borderRadius: '5px', overflow: 'auto', fontSize: '14px', color: '#333' }}>
            {error.message}
          </pre>
        </div>

        {error.networkError && (
          <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ff9800' }}>
            <h3 style={{ marginTop: 0, color: '#e65100' }}>Network Error détecté :</h3>
            <pre style={{ background: '#fff', padding: '15px', borderRadius: '5px', overflow: 'auto', fontSize: '13px' }}>
              {JSON.stringify(error.networkError, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', border: '2px solid #4caf50' }}>
          <h3 style={{ marginTop: 0, color: '#2e7d32' }}>🔧 Solutions possibles :</h3>
          <ol style={{ lineHeight: '1.8', fontSize: '15px' }}>
            <li><strong>Vérifie ton index.js :</strong> L'URL doit être <code style={{background: '#fff', padding: '2px 6px', borderRadius: '3px'}}>http://localhost:8082/graphql</code></li>
            <li><strong>Ouvre la Console du navigateur (F12)</strong> → onglet "Console" → cherche des erreurs CORS en rouge</li>
            <li><strong>Si erreur CORS :</strong> Ton CorsConfig.java doit être dans le bon package et le backend redémarré</li>
            <li><strong>Test backend direct :</strong> Va sur <a href="http://localhost:8082/graphiql" target="_blank">http://localhost:8082/graphiql</a> et teste la query manuellement</li>
            <li><strong>Redémarre tout :</strong> Backend Spring Boot + Frontend React (Ctrl+C puis npm start)</li>
          </ol>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', fontSize: '13px' }}>
          <strong>📋 Configuration actuelle :</strong>
          <ul style={{ marginTop: '10px' }}>
            <li>URL GraphQL : <code>http://localhost:8082/graphql</code></li>
            <li>URL GraphiQL : <code>http://localhost:8082/graphiql</code></li>
            <li>React dev server : <code>http://localhost:3000</code></li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2.5em', marginBottom: '30px' }}>
        Banque GraphQL — TP React ✅
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
        <input
          type="number"
          step="0.01"
          placeholder="Solde initial (ex: 1500.50)"
          value={solde}
          onChange={(e) => setSolde(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', flex: '1', minWidth: '200px' }}
          required
        />
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          style={{ padding: '12px', fontSize: '16px' }}
        >
          <option value="COURANT">Courant</option>
          <option value="EPARGNE">Épargne</option>
          <option value="ENTREPRISE">Entreprise</option>
          <option value="ETUDIANT">Étudiant</option>
        </select>
        <button 
          type="submit" 
          disabled={creating}
          style={{ 
            padding: '12px 30px', 
            background: creating ? '#666' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '16px',
            cursor: creating ? 'not-allowed' : 'pointer'
          }}
        >
          {creating ? 'Création...' : 'Créer le compte'}
        </button>
      </form>

      <div style={{ background: '#e3f2fd', padding: '25px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#1565c0' }}>Statistiques Globales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div><strong>Nombre de comptes :</strong> {data?.totalSolde?.count ?? '0'}</div>
          <div><strong>Solde total :</strong> {(data?.totalSolde?.sum ?? 0).toFixed(2)} MAD</div>
          <div><strong>Solde moyen :</strong> {(data?.totalSolde?.average ?? 0).toFixed(2)} MAD</div>
        </div>
      </div>

      <h2 style={{ color: '#333', marginBottom: '20px' }}>Liste des comptes bancaires</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {(data?.allComptes || []).map(c => (
          <div key={c.id} style={{ 
            border: '2px solid #007bff', 
            padding: '20px', 
            borderRadius: '12px', 
            background: 'white',
            boxShadow: '0 4px 15px rgba(0,123,255,0.2)'
          }}>
            <p style={{ margin: '8px 0', fontSize: '1.1em' }}>
              <strong>ID :</strong> <span style={{ color: '#007bff' }}>#{c.id}</span>
            </p>
            <p style={{ margin: '8px 0', fontSize: '1.5em', fontWeight: 'bold', color: '#2e7d32' }}>
              {c.solde.toFixed(2)} MAD
            </p>
            <p style={{ margin: '8px 0', textTransform: 'capitalize', color: '#555' }}>
              <strong>Type :</strong> {c.type.toLowerCase()}
            </p>
            <small style={{ color: '#888' }}>Créé le {c.dateCreation}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
