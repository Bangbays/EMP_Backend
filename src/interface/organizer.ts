// untuk daftar jadi organizer
export interface OrganizerForm {
  organizationName: string;
  phone: string;
  address: string;
}

// respon status
export interface OrganizerStatus {
  status: "pending" | "approved" | "rejected";
}
