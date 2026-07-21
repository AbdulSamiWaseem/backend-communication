import { AgeResult } from "../domain/ageResults";

const calculateAgeFromDob = (dob: string): AgeResult => {
  const birthDate = new Date(dob);

  if (Number.isNaN(birthDate.getTime())) {
    throw new Error("Invalid date of birth");
  }

  if (birthDate > new Date()) {
    throw new Error("Date of birth cannot be in the future");
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return { dob, age };
};

/**
 * Simulates a slow third-party age calculation (30–40 seconds).
 */
export const computeAgeFromDob = async (dob: string): Promise<AgeResult> => {
  // Fail fast on invalid input; only the happy path is delayed.
  calculateAgeFromDob(dob);

  const delayMs = 30_000 + Math.floor(Math.random() * 10_001);

  console.log(
    `[age] computing age for ${dob} (~${Math.round(delayMs / 1000)}s)`
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      const result = calculateAgeFromDob(dob);
      console.log(`[age] finished for ${dob}: age=${result.age}`);
      resolve(result);
    }, delayMs);
  });
};
