export default function TermsCheckbox({ checked, onChange, termsVersion, error }) {
  return (
    <div className="checkbox-field">
      <input
        id="acceptTerms"
        name="acceptTerms"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor="acceptTerms">
        I agree to the FixEasy Terms &amp; Conditions (version {termsVersion || 'loading…'}).
      </label>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  )
}
