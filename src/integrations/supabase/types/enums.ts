export type CommitteeType = 'candidate' | 'organization';
export type PostcardStatus = 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
export type QueueStatus = 
  | 'pending_verification'
  | 'verification_failed'
  | 'verification_complete'
  | 'pending_postcard'
  | 'postcard_queued'
  | 'processing_complete'
  | 'failed';