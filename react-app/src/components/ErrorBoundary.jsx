/**
 * The 500 page — the port of views/error.php.
 *
 * Deliberately carries the phone CTA: a visitor who arrived from a paid click
 * and hit a render fault is still a lead, and a dead-end error page throws that
 * click away.
 *
 * Never renders the error message, class or stack. Those go to the console; the
 * visitor gets a reference they can quote instead.
 */

import { Component } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCta } from './PhoneLink.jsx';

const reference = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { ref: null };
  }

  static getDerivedStateFromError() {
    return { ref: reference() };
  }

  componentDidCatch(error, info) {
    /* Everything useful goes to the console, where it can be read in a session
       replay or a browser error reporter — never into the page. */
    console.error(`[${this.state.ref ?? 'render'}]`, error, info?.componentStack);
  }

  render() {
    if (!this.state.ref) return this.props.children;

    return (
      <section className="section">
        <div className="wrap">
          <div className="notfound">
            <p className="notfound__code" aria-hidden="true">
              500
            </p>
            <h1>Something went wrong on our side.</h1>
            <p className="lede">
              The page could not be loaded. This is a fault with the website, not with anything you
              did.
            </p>
            <p className="muted">You can still reach the team by phone during published hours.</p>

            <div className="notfound__actions">
              <Link className="btn btn--dark" to="/">
                Return home
              </Link>
              <PhoneCta placement="error_500" className="btn btn--call" />
            </div>

            <p className="fineprint" style={{ marginTop: 'var(--s6)' }}>
              Reference: {this.state.ref}
            </p>
          </div>
        </div>
      </section>
    );
  }
}
