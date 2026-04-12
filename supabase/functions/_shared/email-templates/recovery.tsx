/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="pt" dir="ltr">
    <Head />
    <Preview>Repõe a tua password para {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>Voice³</Text>
        <Heading style={h1}>Repõe a tua password</Heading>
        <Text style={text}>
          Recebemos um pedido para repor a tua password no {siteName}. Clica no
          botão abaixo para escolher uma nova password.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Repor Password
        </Button>
        <Text style={footer}>
          Se não pediste a reposição da password, podes ignorar este email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
const button = {
  backgroundColor: '#C9A84C',
  color: '#0a1628',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  borderRadius: '10px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
