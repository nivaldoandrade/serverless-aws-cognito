import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

interface ISignInTemplate {
  confirmationCode: string;
}

export default function SignUpTemplate({ confirmationCode }: ISignInTemplate) {
  return (
    <Html>
      <Body style={main}>
        <Preview>Código de confirmação de email</Preview>
        <Container style={container}>
          <Heading as="h1" style={heading}>
            Código de confirmação de email
          </Heading>
          <Text style={heroText}>
            O seu código de confirmação de email está abaixo - insira-o na
            janela aberta do seu navegador e nós ajudaremos você a fazer a
            confirmação.
          </Text>

          <Section style={sectionCode}>
            <Text style={codeText}>{confirmationCode}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

SignUpTemplate.PreviewProps = {
  confirmationCode: '459159',
} as ISignInTemplate;

// bg-white my-0 mx-auto font-sans
const main = {
  backgroundColor: '#ffffff',
  margin: '0px auto',
  fontFamily:
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji',
};

// my-0 mx-auto py-0 px-5
const container = {
  margin: '0px auto',
  padding: '0px 16px',
};

// text-center
const heading = {
  textAlign: 'center' as const,
};

// text-eerie-black leading-7 mb-[30px]
const heroText = {
  color: '#1D1C1D',
  lineHeight: '28px',
  marginBottom: '30px',
};

// bg-gray-200 rounded-sm mb-[30px] py-[40px] px-[10px]
const sectionCode = {
  backgroundColor: '#e5e7eb',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 10px',
};

// text-3xl text-center align-middle
const codeText = {
  fontSize: '30px',
  textAlign: 'center' as const,
  verticalAlign: 'middle',
};
