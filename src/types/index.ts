export interface Prize {
  id_prize: number;
  name: string;
  range_start: number;
  range_end: number;
  sorteado: boolean;
}

export interface Participant {
  id_participant: number;
  name: string;
  cedula: string;
  ticket_number: string;
  active: boolean;
}

export type PrizeOrParticipant = Prize | Participant;

export interface Winner {
  id_winner: number;
  id_prize: number;
  id_participant: number;
  drawDate: string;
  participant_name: string;
  participant_number: string;
  prize_name: string;
}

