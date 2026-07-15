/** Export/import helpers for Job Applications data (JSON). */

export function validateJobApplications(data) {
  if (!Array.isArray(data)) {
    throw new Error("Backup must be a JSON array of applications.");
  }
  
  return data.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Item at index ${index} is not a valid object.`);
    }

    const company = item.company || item.Company;
    const role = item.role || item.title || item.Role || item.Title;
    const status = item.status || item.Status;

    if (typeof company !== "string" || !company.trim()) {
      throw new Error(`Item at index ${index} is missing a valid 'company' name.`);
    }
    if (typeof role !== "string" || !role.trim()) {
      throw new Error(`Item at index ${index} is missing a valid 'role' or 'title'.`);
    }
    if (typeof status !== "string" || !status.trim()) {
      throw new Error(`Item at index ${index} is missing a valid 'status'.`);
    }

    return {
      id: item.id || Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      company: company.trim(),
      role: role.trim(),
      status: status.trim(),
      platform: typeof item.platform === "string" ? item.platform.trim() : "Other",
      workMode: typeof item.workMode === "string" ? item.workMode.trim() : "Remote",
      applicationDate: typeof item.applicationDate === "string" ? item.applicationDate : new Date().toISOString().split("T")[0],
      jobUrl: typeof item.jobUrl === "string" ? item.jobUrl.trim() : "",
      notes: typeof item.notes === "string" ? item.notes.trim() : "",
      createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    };
  });
}

export function exportJobApplications(rows) {
  const blob = new Blob([JSON.stringify(rows ?? [], null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `job-applications-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseJobApplicationsFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "[]"));
        const validated = validateJobApplications(data);
        resolve(validated);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

