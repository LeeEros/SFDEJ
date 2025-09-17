import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "./SignInForm";


export default function SignIn() {
  return (
    <>
      <PageMeta
        title="SFDEJ - Sign In"
        description="Sistema de Feedback de Empresários Juniores - Sign In Page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
