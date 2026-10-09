export function validateAddress(body) {
  const allowedFields = ["label", "fullName", "phone", "address", "line2", "area", "city", "state", "postalCode", "country", "isDefault"];
  if (Object.keys(body).some((field) => !allowedFields.includes(field))) return { error: "Unsupported address field" };
  if (body.isDefault !== undefined && typeof body.isDefault !== "boolean") return { error: "Default address setting is invalid" };
  const address = {
    label: String(body.label || "Home").trim(),
    fullName: String(body.fullName || "").trim(),
    phone: String(body.phone || "").trim(),
    address: String(body.address || "").trim(),
    line2: String(body.line2 || body.area || "").trim(),
    city: String(body.city || "").trim(),
    state: String(body.state || "").trim(),
    postalCode: String(body.postalCode || "").trim(),
    country: String(body.country || "Bangladesh").trim(),
    isDefault: body.isDefault === true,
  };
  if (!address.fullName || !address.phone || !address.address || !address.city || !address.postalCode || !address.country) {
    return { error: "Name, phone, address, city, postal code and country are required" };
  }
  if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(address.phone)) return { error: "Please provide a valid phone number" };
  if (address.label.length > 30 || address.fullName.length > 100 || address.address.length > 250 || address.line2.length > 150 || address.city.length > 80 || address.state.length > 80 || address.postalCode.length > 20 || address.country.length > 80) {
    return { error: "One or more address fields exceed the allowed length" };
  }
  return { address };
}
