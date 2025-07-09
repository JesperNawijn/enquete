"use client"

import type React from "react"

import { useState } from "react"

export default function SurveyPreview() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    country: "",
    country_other: "",
    weight_problems: "",
    self_image: "",
    body_satisfaction: 5,
    weight_influence: "",
    social_media_hours: "",
    platforms: [] as string[],
    content_types: [] as string[],
    comparison_frequency: "",
    influence_eating: "",
    influence_exercise: "",
    influence_screen_time: "",
    influence_social: "",
    solutions: [] as string[],
    education_importance: 5,
    platform_responsibility: 5,
  })

  const [error, setError] = useState("")
  const [showThankYou, setShowThankYou] = useState(false)

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name as keyof typeof prev] as string[]), value]
        : (prev[name as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const requiredFields = {
      age: "Leeftijd",
      gender: "Geslacht",
      country: "Land",
      weight_problems: "Zorgen over gewicht",
      self_image: "Zelfbeeld",
      weight_influence: "Invloed gewicht op gevoel",
      social_media_hours: "Sociale media uren",
      comparison_frequency: "Vergelijking frequentie",
      influence_eating: "Invloed op eetgedrag",
      influence_exercise: "Invloed op beweeggedrag",
      influence_screen_time: "Invloed op schermtijd",
      influence_social: "Invloed op sociaal gedrag",
    }

    const missingFields = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === "") {
        missingFields.push(label)
      }
    }

    if (formData.platforms.length === 0) {
      missingFields.push("Sociale media platforms (minimaal één)")
    }
    if (formData.content_types.length === 0) {
      missingFields.push("Content types (minimaal één)")
    }
    if (formData.solutions.length === 0) {
      missingFields.push("Oplossingen/maatregelen (minimaal één)")
    }

    if (formData.country === "Anders" && !formData.country_other.trim()) {
      missingFields.push('Land specificatie (bij "Anders")')
    }

    if (missingFields.length > 0) {
      setError(`De volgende velden zijn verplicht: ${missingFields.join(", ")}`)
      return
    }

    setError("")
    setShowThankYou(true)
  }

  const RangeSlider = ({
    name,
    value,
    label,
    min = 1,
    max = 10,
  }: {
    name: string
    value: number
    label: string
    min?: number
    max?: number
  }) => {
    return (
      <div className="form-group">
        <label htmlFor={name}>{label} *</label>
        <div className="range-container">
          <input
            type="range"
            name={name}
            id={name}
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleInputChange(name, Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            required
          />
          <div className="range-numbers">
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
              <span
                key={num}
                className={`cursor-pointer px-1 py-1 text-sm font-semibold rounded ${
                  value === num ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => handleInputChange(name, num)}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
        <div className="range-labels">
          <span className="text-sm text-gray-600 italic">
            {min} (
            {name.includes("satisfaction")
              ? "Zeer ontevreden"
              : name.includes("education")
                ? "Niet belangrijk"
                : "Niet verantwoordelijk"}
            )
          </span>
          <span className="text-sm text-gray-600 italic">
            {max} (
            {name.includes("satisfaction")
              ? "Zeer tevreden"
              : name.includes("education")
                ? "Zeer belangrijk"
                : "Volledig verantwoordelijk"}
            )
          </span>
        </div>
      </div>
    )
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Bedankt voor je deelname!</h1>
            <p className="text-lg mb-4 text-gray-700">
              Je antwoorden zijn succesvol en anoniem opgeslagen. Deze informatie helpt ons om de invloed van sociale
              media op het zelfbeeld van jongeren beter te begrijpen.
            </p>
            <p className="text-gray-600 mb-6">
              Je antwoorden zijn volledig anoniem en worden alleen gebruikt voor onderzoeksdoeleinden.
            </p>
            <button
              onClick={() => {
                setShowThankYou(false)
                setFormData({
                  age: "",
                  gender: "",
                  country: "",
                  country_other: "",
                  weight_problems: "",
                  self_image: "",
                  body_satisfaction: 5,
                  weight_influence: "",
                  social_media_hours: "",
                  platforms: [],
                  content_types: [],
                  comparison_frequency: "",
                  influence_eating: "",
                  influence_exercise: "",
                  influence_screen_time: "",
                  influence_social: "",
                  solutions: [],
                  education_importance: 5,
                  platform_responsibility: 5,
                })
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Terug naar de enquête
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <header className="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Enquête: Sociale Media & Zelfbeeld</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Deze enquête onderzoekt de invloed van sociale media op het zelfbeeld van jongeren. Je antwoorden zijn
            volledig anoniem en worden gebruikt voor onderzoeksdoeleinden.
          </p>
        </header>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Demografische gegevens */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">Over jezelf</h2>

            <div className="form-group mb-6">
              <label htmlFor="age" className="block mb-2 font-semibold text-gray-700">
                Hoe oud ben je? *
              </label>
              <select
                name="age"
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Selecteer je leeftijd</option>
                {Array.from({ length: 7 }, (_, i) => i + 12).map((age) => (
                  <option key={age} value={age}>
                    {age} jaar
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Wat is je geslacht? *</label>
              <div className="space-y-2">
                {["Man", "Vrouw", "Anders", "Wil ik niet zeggen"].map((option) => (
                  <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="mr-3 scale-125"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">In welk land woon je? *</label>
              <div className="space-y-2">
                {["Nederland", "België", "Luxemburg", "Anders"].map((option) => (
                  <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="country"
                      value={option}
                      checked={formData.country === option}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="mr-3 scale-125"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
              {formData.country === "Anders" && (
                <input
                  type="text"
                  name="country_other"
                  placeholder="Welk land?"
                  value={formData.country_other}
                  onChange={(e) => handleInputChange("country_other", e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mt-3"
                  required
                />
              )}
            </div>
          </section>

          {/* Gewicht en zelfbeeld */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Gewicht en zelfbeeld
            </h2>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Heb je wel eens zorgen gehad over je gewicht? *
              </label>
              <div className="space-y-2">
                {["Nooit", "Soms", "Vaak", "Altijd"].map((option) => (
                  <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="weight_problems"
                      value={option}
                      checked={formData.weight_problems === option}
                      onChange={(e) => handleInputChange("weight_problems", e.target.value)}
                      className="mr-3 scale-125"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Hoe zou je je zelfbeeld omschrijven? *</label>
              <div className="space-y-2">
                {["Zeer positief", "Positief", "Neutraal", "Negatief", "Zeer negatief"].map((option) => (
                  <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="self_image"
                      value={option}
                      checked={formData.self_image === option}
                      onChange={(e) => handleInputChange("self_image", e.target.value)}
                      className="mr-3 scale-125"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <RangeSlider
              name="body_satisfaction"
              value={formData.body_satisfaction}
              label="Hoe tevreden ben je met je lichaam? (1 = zeer ontevreden, 10 = zeer tevreden)"
            />

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Heeft je gewicht invloed op hoe je je voelt? *
              </label>
              <div className="space-y-2">
                {["Helemaal niet", "Een beetje", "Behoorlijk", "Heel veel"].map((option) => (
                  <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="weight_influence"
                      value={option}
                      checked={formData.weight_influence === option}
                      onChange={(e) => handleInputChange("weight_influence", e.target.value)}
                      className="mr-3 scale-125"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Sociale media gebruik */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Sociale media gebruik
            </h2>

            <div className="form-group mb-6">
              <label htmlFor="social_media_hours" className="block mb-2 font-semibold text-gray-700">
                Hoeveel uur per dag besteed je gemiddeld aan sociale media? *
              </label>
              <select
                name="social_media_hours"
                id="social_media_hours"
                value={formData.social_media_hours}
                onChange={(e) => handleInputChange("social_media_hours", e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Selecteer aantal uur</option>
                <option value="0">Minder dan 1 uur</option>
                <option value="1">1-2 uur</option>
                <option value="3">3-4 uur</option>
                <option value="5">5-6 uur</option>
                <option value="7">Meer dan 6 uur</option>
              </select>
            </div>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Welke sociale media platforms gebruik je? * (minimaal één antwoord)
              </label>
              <div className="space-y-2">
                {["Instagram", "TikTok", "Snapchat", "YouTube", "Facebook", "Twitter", "Anders"].map((platform) => (
                  <label key={platform} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      name="platforms"
                      value={platform}
                      checked={formData.platforms.includes(platform)}
                      onChange={(e) => handleCheckboxChange("platforms", platform, e.target.checked)}
                      className="mr-3 scale-125"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Welke soorten content bekijk je het meest? * (minimaal één antwoord)
              </label>
              <div className="space-y-2">
                {[
                  "Fitness/sport",
                  "Mode/beauty",
                  "Eten/recepten",
                  "Lifestyle",
                  "Entertainment",
                  "Nieuws",
                  "Vrienden/familie",
                ].map((content) => (
                  <label key={content} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      name="content_types"
                      value={content}
                      checked={formData.content_types.includes(content)}
                      onChange={(e) => handleCheckboxChange("content_types", content, e.target.checked)}
                      className="mr-3 scale-125"
                    />
                    {content}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Hoe vaak vergelijk je jezelf met anderen op sociale media? *
              </label>
              <div className="space-y-2">
                {["Nooit", "Zelden", "Soms", "Vaak", "Altijd"].map((option) => (
                  <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="comparison_frequency"
                      value={option}
                      checked={formData.comparison_frequency === option}
                      onChange={(e) => handleInputChange("comparison_frequency", e.target.value)}
                      className="mr-3 scale-125"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Invloed op gedrag */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Invloed op gedrag
            </h2>

            {[
              { name: "influence_eating", label: "Heeft sociale media invloed op je eetgedrag?" },
              { name: "influence_exercise", label: "Heeft sociale media invloed op je beweeggedrag?" },
              { name: "influence_screen_time", label: "Heeft sociale media invloed op je schermtijd?" },
              { name: "influence_social", label: "Heeft sociale media invloed op je sociale gedrag?" },
            ].map(({ name, label }) => (
              <div key={name} className="form-group mb-6">
                <label className="block mb-2 font-semibold text-gray-700">{label} *</label>
                <div className="space-y-2">
                  {["Helemaal niet", "Een beetje", "Behoorlijk", "Heel veel"].map((option) => (
                    <label key={option} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                      <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={formData[name as keyof typeof formData] === option}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className="mr-3 scale-125"
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Oplossingen */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Oplossingen en maatregelen
            </h2>

            <div className="form-group mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Welke maatregelen zouden volgens jou helpen? * (minimaal één antwoord)
              </label>
              <div className="space-y-2">
                {[
                  "Meer voorlichting op school",
                  "Strengere regels voor sociale media",
                  "Betere filters en rapportage",
                  "Meer positieve rolmodellen",
                  "Tijdslimieten op apps",
                  "Meer offline activiteiten",
                ].map((solution) => (
                  <label key={solution} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      name="solutions"
                      value={solution}
                      checked={formData.solutions.includes(solution)}
                      onChange={(e) => handleCheckboxChange("solutions", solution, e.target.checked)}
                      className="mr-3 scale-125"
                    />
                    {solution}
                  </label>
                ))}
              </div>
            </div>

            <RangeSlider
              name="education_importance"
              value={formData.education_importance}
              label="Hoe belangrijk vind je voorlichting over sociale media? (1 = niet belangrijk, 10 = zeer belangrijk)"
            />

            <RangeSlider
              name="platform_responsibility"
              value={formData.platform_responsibility}
              label="In hoeverre zijn sociale media platforms verantwoordelijk voor het welzijn van gebruikers? (1 = niet verantwoordelijk, 10 = volledig verantwoordelijk)"
            />
          </section>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Enquête versturen
          </button>
        </form>
      </div>
    </div>
  )
}
