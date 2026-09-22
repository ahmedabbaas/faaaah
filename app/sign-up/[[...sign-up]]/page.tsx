import { SignUp } from "@clerk/nextjs";
import ThemeToggle from "../../components/ThemeToggle";

export default function Page() {
  return (
    <main className="authPage">
      <div className="authBackdrop" aria-hidden="true" />
      <div className="authShell">
        <div className="authTop">
          <a className="authBrand" href="/">
            Global<span>Pedia</span>
          </a>
          <ThemeToggle />
        </div>
        <div className="authIntro">
          <span>GLOBALPEDIA ACCOUNT</span>
          <h1>Create your account.</h1>
          <p>Save knowledge, follow topics and build your personal world index.</p>
        </div>
        <SignUp />
      </div>
    </main>
  );
}
