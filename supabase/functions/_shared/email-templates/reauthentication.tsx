/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="pt" dir="ltr">
    <Head />
    <Preview>O teu código de verificação</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>Voice³</Text>
        <Heading style={h1}>Confirma a tua identidade</Heading>
        <Text style={text}>Usa o código abaixo para confirmar a tua identidade:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Este código expira em breve. Se não pediste isto, podes ignorar este email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const logo = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#C9A84C',
  margin: '0 0 24px',
  letterSpacing: '-0.5px',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#0a1628',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const codeStyle = {
  fontFamily: "'JetBrains Mono', Courier, monospace",
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#C9A84C',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
