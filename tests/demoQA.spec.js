import { test, expect, request } from '@playwright/test';
import { generateRandomString } from '../utils/GetRandomString';
import 'dotenv/config'
let userName = `TestUser${generateRandomString(10)}`;
let UUID;
let token;
let isbn = generateRandomString(9);
let password = 'Test@123'
test('Creation of user account ', async ({ request }) => {
  const response = await request.post(`/Account/v1/User`, {
    data: {
      userName: userName,
      password: password
    }

  });
  await response.json().then(json => {
    UUID = json.userID;
    console.log(json.userID);
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);
});

test('Generate User Token', async ({ request },) => {
  const response = await request.post(`/Account/v1/GenerateToken`, {
    data: {
      userName: userName,
      password: password
    }
  });
  console.log((await response.body()).toString());
  await response.json().then(json => {
    token = json.token;
  });
  expect(response.body().toString().includes('Success'));
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  process.env.API_TOKEN = token;
})
test('Add Books to user', async ({ request }) => {
  const response = await request.post('/BookStore/v1/Books', {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    },
    data: {
      userId: UUID,
      collectionOfIsbns: [
        {
          isbn: isbn
        },
        {
          isbn: isbn + 1
        }
      ]
    },
  });
  console.log((await response.body()).toString())
});

test('Remove Books to user', async ({ request }) => {
  const response = await request.delete('/BookStore/v1/Book', {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    },
    data: {
      isbn: isbn,
      userId: UUID
    },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(204);
});

test('Remove All Books from user', async ({ request }) => {
  const response = await request.delete(`/BookStore/v1/Books?UserId=${UUID}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    }
  });
  console.log((await response.body()).toString());
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(204);
});



test.skip('Get User info', async ({ request }) => {
  const response = await request.get(`Account/v1/User/${UUID}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    }
  });
  console.log((await response.body()).toString())
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test.skip('Authorize User', async ({ request }) => {
  const response = await request.post('Account/v1/Authorized', {
    data: {
      userName: userName,
      password: password
    },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  expect((await response.body()).includes('true'));
})