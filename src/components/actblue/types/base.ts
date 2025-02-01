export type CandidateSuffix = "Jr." | "Sr." | "II" | "III" | "IV" | "V";
export type CommitteeType = "candidate" | "organization";

export type OfficeSought = 
  | "U.S. President"
  | "U.S. Senator"
  | "U.S. Representative"
  | "Governor"
  | "Lieutenant Governor"
  | "State Senator"
  | "State Representative"
  | "Attorney General"
  | "Secretary of State"
  | "State Treasurer"
  | "Mayor"
  | "City Council Member"
  | "County Commissioner"
  | "District Attorney"
  | "Sheriff"
  | "School Board Member";

export const officeOptions: OfficeSought[] = [
  "U.S. President",
  "U.S. Senator",
  "U.S. Representative",
  "Governor",
  "Lieutenant Governor",
  "State Senator",
  "State Representative",
  "Attorney General",
  "Secretary of State",
  "State Treasurer",
  "Mayor",
  "City Council Member",
  "County Commissioner",
  "District Attorney",
  "Sheriff",
  "School Board Member"
];