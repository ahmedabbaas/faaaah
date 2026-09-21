import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="authPage">
      <div className="authBackdrop" />
      <div className="authShell">
        <a className="authBrand" href="/">
          Global<span>Pedia</span>
        </a>
        <SignIn />
      </div>
    </main>
  );
}