const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const redirectUri = 'http://localhost:5173';

function Login() {
  const loginUrl = `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return (
    <div className="login-page">
      <h1>Welcome to ChatBot</h1>
      <button className="login-btn" onClick={() => window.location.href = loginUrl}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;