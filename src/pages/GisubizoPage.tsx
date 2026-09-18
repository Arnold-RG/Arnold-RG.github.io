import { GisubizoChat } from '../components/GisubizoChat'
import { QA_BANK } from '../gisubizo/qa'

export function GisubizoPage() {
  return (
    <div className="page-pad giso-page">
      <header className="page-hero">
        <p className="eyebrow">Gisubizo · English answers</p>
        <h1>Ask Rwanda. Get a correct answer.</h1>
        <p className="lede">
          Gisubizo replies in English only. It matches your question to a verified fact about
          Rwanda or Hamwe — parks, history, visas, tours, hours. {QA_BANK.length} ready questions
          sit under the chat.
        </p>
      </header>
      <GisubizoChat />
    </div>
  )
}
