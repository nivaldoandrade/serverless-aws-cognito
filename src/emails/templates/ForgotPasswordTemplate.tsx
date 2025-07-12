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

interface IForgotPasswordTemplate {
  confirmationCode: string;
}

export default function ForgotPasswordTemplate({
  confirmationCode,
}: IForgotPasswordTemplate) {
  return (
    <TailwindConfig>
      <Body className="bg-white my-0 mx-auto font-sans">
        <Preview>Código de recuperação de senha</Preview>
        <Container className="my-0 mx-auto py-0 px-5">
          <Heading as="h1" className="text-center">
            Código de recuperação de senha
          </Heading>
          <Text className="text-eerie-black leading-7 mb-[30px]">
            O seu código de recuperação de senha está abaixo - insira-o na
            janela aberta do seu navegador e nós ajudaremos você a fazer o
            recuperação.
          </Text>

          <Section className="bg-gray-200 rounded-sm mb-[30px] py-[40px] px-[10px]">
            <Text className="text-3xl text-center align-middle">
              {confirmationCode}
            </Text>
          </Section>

          <Text className="text-black text-sm leading-6 text-center">
            Se não solicitou este e-mail, não há motivo para preocupação, pode
            ignorá-lo com segurança.
          </Text>
        </Container>
      </Body>
    </TailwindConfig>
  );
}

ForgotPasswordTemplate.PreviewProps = {
  confirmationCode: '459159',
} as IForgotPasswordTemplate;
