import {
  Body,
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';
import { TailwindConfig } from '../components/TailwindConfig';

interface ISignInTemplate {
  confirmationCode: string;
}

export default function SignUpTemplate({ confirmationCode }: ISignInTemplate) {
  return (
    <TailwindConfig>
      <Body className="bg-white my-0 mx-auto font-sans">
        <Preview>Código de confirmação de email</Preview>
        <Container className="my-0 mx-auto py-0 px-5">
          <Heading as="h1" className="text-center">
            Código de confirmação de email
          </Heading>
          <Text className="text-eerie-black leading-7 mb-[30px]">
            O seu código de confirmação de email está abaixo - insira-o na
            janela aberta do seu navegador e nós ajudaremos você a fazer a
            confirmação.
          </Text>

          <Section className="bg-gray-200 rounded-sm mb-[30px] py-[40px] px-[10px]">
            <Text className="text-3xl text-center align-middle">
              {confirmationCode}
            </Text>
          </Section>
        </Container>
      </Body>
    </TailwindConfig>
  );
}

SignUpTemplate.PreviewProps = {
  confirmationCode: '459159',
} as ISignInTemplate;
