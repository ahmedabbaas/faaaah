import { SignIn } from "@clerk/nextjs";
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
          <h1>Welcome back.</h1>
          <p>Sign in to keep your library, follows and reading history connected.</p>
        </div>
        <SignIn />
      </div>
    </main>
  );
}
