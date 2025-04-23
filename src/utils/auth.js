// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export function parseTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const idToken = params.get('id_token');
  if (idToken) {
    localStorage.setItem('idToken', idToken);
  }
  return {
    idToken,
    accessToken: params.get('access_token'),
  };
}

export function getStoredIdToken() {
  return localStorage.getItem('idToken');
}

export function getUserInfo(token) {
  const decoded = jwtDecode(token);
  return {
    name: decoded.name,
    email: decoded.email,
  };
}

export function logout() {
  localStorage.removeItem('idToken');
  window.location.replace("/");
}
