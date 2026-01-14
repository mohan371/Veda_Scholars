import axios from "axios";

const API_URL = "http://localhost:8483/graphql";

async function runTests() {
  console.log("🚀 Starting GraphQL Auth Verification Tests...");

  const uniqueEmail = `test_${Date.now()}@example.com`;
  const password = "password123";

  // 1. Test Signup (RegisterUser Mutation)
  console.log("\n1. Testing Signup (Mutation)...");
  const registerMutation = `
    mutation RegisterUser($name: String!, $email: String!, $password: String!, $phone: String!, $userType: String!) {
      registerUser(name: $name, email: $email, password: $password, phone: $phone, userType: $userType) {
        token
        user {
          email
          role
        }
      }
    }
  `;

  try {
    const res = await axios.post(API_URL, {
      query: registerMutation,
      variables: {
        name: "Test User",
        email: uniqueEmail,
        password: password,
        phone: "1234567890",
        userType: "student",
      },
    });

    if (res.data.errors) {
      console.error("❌ Signup Failed:", JSON.stringify(res.data.errors, null, 2));
    } else {
      console.log("✅ Signup Successful:", res.data.data.registerUser.user.email);
    }
  } catch (error: any) {
    console.error("❌ Signup Request Failed:");
    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("ERROR:", error.message);
    }
  }

  // 2. Test Login (LoginUser Mutation)
  console.log("\n2. Testing Login (Mutation)...");
  const loginMutation = `
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        token
        user {
          email
        }
      }
    }
  `;

  try {
    const res = await axios.post(API_URL, {
      query: loginMutation,
      variables: {
        email: uniqueEmail,
        password: password,
      },
    });

    if (res.data.errors) {
      console.error("❌ Login Failed:", JSON.stringify(res.data.errors, null, 2));
    } else {
      console.log("✅ Login Successful. Token received.");
    }
  } catch (error: any) {
    console.error("❌ Login Request Failed:");
    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("ERROR:", error.message);
    }
  }
}

runTests();
