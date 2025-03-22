import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoginForm currentUser={null} />
    </div>
  );
};

export default LoginPage;