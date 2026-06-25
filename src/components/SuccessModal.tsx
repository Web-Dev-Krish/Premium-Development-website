import { motion } from 'framer-motion';
import { X, Phone, Calendar, CheckCircle2 } from 'lucide-react';

export default function SuccessModal({ mobileNumber, appointmentUrl, onClose }: { mobileNumber: string; appointmentUrl: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md p-8 rounded-2xl border border-white/10 bg-neutral-900 text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl text-white font-light mb-2">Project Submitted</h3>
        <p className="text-neutral-400 text-sm mb-6">Your project details have been received. We'll review and contact you shortly.</p>

        <div className="space-y-3">
          <a href={`tel:${mobileNumber}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors">
            <Phone className="w-4 h-4" /> {mobileNumber}
          </a>
          <a href={appointmentUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 transition-colors">
            <Calendar className="w-4 h-4" /> Book Appointment
          </a>
        </div>
      </motion.div>
    </div>
  );
}
