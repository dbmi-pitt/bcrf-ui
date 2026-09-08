import React from 'react';
import { Body, Container, Heading, Html, Text } from 'react-email';

export default function GlobusDataSetEmail({ user, sourceName }) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>
            The following user is requesting Globus Data Set access to:{' '}
            {sourceName}
          </Heading>
          <Text>User Information:</Text>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
          <Text>{user.organization}</Text>
          <Text>{user.uuid}</Text>
        </Container>
      </Body>
    </Html>
  );
}
