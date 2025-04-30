# Project Name
Full Stack Engineer Assignment

## Description

This project provides a backend system for managing departments, users, and their relationships. It supports features like user authentication (sign up and login), department creation, updates, pagination of departments, and bulk delete operations (including cascading effects on sub-departments).

## Project Setup

Before running the project, make sure you have the following prerequisites installed:

- **Node.js** (version 22.x)
- **Yarn** (for package management)

### Install Dependencies

To install all the necessary dependencies for the project, run the following command in the project’s root directory:

```bash
$ yarn install
```

This will install all required packages and dependencies specified in the `package.json` file.

### Configure Environment Variables

Before running the app, ensure that the environment variables are set up correctly. You may need to create a `.env` file in the root directory of the project, based on the example `.env.example` file.

### Compile and Run the Project

Once the dependencies are installed and environment variables are set up, you can start the application.

#### Development Mode (with auto-reload):

```bash
$ yarn run start:dev
```

This will run the app in development mode with auto-reloading enabled.

#### Production Mode:

To run the app in production mode (after building it):

```bash
$ yarn run start:prod
```

This will start the app in production mode. Ensure you’ve built the app first by running `yarn build`.

---

## 🚀 Live API Testing (Apollo Sandbox)

You can interact with the live API using Apollo's GraphQL sandbox.

> **Sandbox URL:**  
> [https://studio.apollographql.com/sandbox/explorer](https://studio.apollographql.com/sandbox/explorer)

### To test:
1. Open the URL above.
2. In the input field for GraphQL Endpoint, paste:

```
https://fullstack-backend-test-aw0t.onrender.com/graphql
```

3. Start writing and running queries/mutations.



## Alternative Way To Test In Local Development (This doesnt work in the live link)
Goto [http://localhost:5006/graphql](http://localhost:5006/graphql) to Access the playground

---
## Example GraphQL Queries & Mutations

Here are some example queries and mutations for testing the app’s functionality. Make sure to use them after signing up or logging in to get the required access token.

### Login Mutation

This mutation logs in a user by providing the correct username and password.

```graphql
mutation {
  login(input: { username: "bezz", password: "secret123" }) {
    accessToken
    username
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "login": {
      "accessToken": "your_access_token_here",
      "username": "bezz"
    }
  }
}
```

### Signup Mutation

This mutation creates a new user.

```graphql
mutation {
  signup(input: { username: "bezz", password: "secret123" }) {
    accessToken
    username
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "signup": {
      "accessToken": "your_access_token_here",
      "username": "bezz"
    }
  }
}
```

### Get Departments Query (with Pagination)

This query retrieves a list of departments, supporting pagination.

```graphql
query {
  getDepartments(page: 1, limit: 2) {
    id
    name
    createdBy {
      id
      username
    }
    subDepartments {
      id
      name
    }
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "getDepartments": [
      {
        "id": 1,
        "name": "Department A",
        "createdBy": {
          "id": 1,
          "username": "bezz"
        },
        "subDepartments": [
          {
            "id": 2,
            "name": "SubDepartment 1"
          }
        ]
      }
    ]
  }
}
```

### Create Department with Sub-departments Mutation

This mutation creates a department with sub-departments.

```graphql
mutation createDepartment {
  createDepartment(input: {
    name: "BioInformatic",
    subDepartments: [
      { name: "Class 1" }
    ]
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "createDepartment": {
      "id": 1,
      "name": "BioInformatic",
      "subDepartments": [
        {
          "id": 1,
          "name": "Class 1"
        }
      ]
    }
  }
}
```

### Create Department without Sub-departments Mutation

This mutation creates a department without any sub-departments.

```graphql
mutation createDepartment {
  createDepartment(input: {
    name: "BioInformatisian"
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "createDepartment": {
      "id": 2,
      "name": "BioInformatisian",
      "subDepartments": []
    }
  }
}
```

### Update Department Mutation

This mutation updates the name of an existing department.

```graphql
mutation UpdateDepartment {
  updateDepartment(input: {
    id: 3,
    name: "New Department Na"
  }) {
    id
    name
  }
}
```

- **Response Example:**

```json
{
  "data": {
    "updateDepartment": {
      "id": 3,
      "name": "New Department Na"
    }
  }
}
```

### Bulk Delete Departments Mutation

This mutation deletes multiple departments in bulk, including cascading deletions of any sub-departments.

```graphql
mutation DeleteDepartments {
  deleteDepartments(ids: [1, 3, 12])
}
```

- **Response Example:**

```json
{
  "data": {
    "deleteDepartments": true
  }
}
```

## Deployment

The project is deployed and hosted on **Render.com**. You can access the live version of the application here:

- **[Render.com Link](https://your-app-link-on-render.com)**

## Stay in Touch

- **Author:** [Bezaleel Nwabia](https://ng.linkedin.com/in/bezaleel-nwabia)

If you encounter any issues, feel free to open an issue in the repository, and I will try to assist you.

