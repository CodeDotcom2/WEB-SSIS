"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type NotifyOptions = { title?: string; type?: "info" | "success" | "error" };

type NotificationContextType = {
  notify: (message: string, opts?: NotifyOptions) => void;
  confirm: (message: string, title?: string) => Promise<boolean>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string | undefined>(undefined);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmResolve = useRef<((value: boolean) => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState<string | undefined>(
    undefined
  );

  function notify(message: string, opts?: NotifyOptions) {
    setAlertMessage(message);
    setAlertTitle(opts?.title);
    setAlertOpen(true);
  }

  function confirm(message: string, title?: string) {
    return new Promise<boolean>((resolve) => {
      confirmResolve.current = resolve;
      setConfirmMessage(message);
      setConfirmTitle(title);
      setConfirmOpen(true);
    });
  }

  function handleConfirm(ok: boolean) {
    setConfirmOpen(false);
    if (confirmResolve.current) {
      confirmResolve.current(ok);
      confirmResolve.current = null;
    }
  }

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Alert dialog (simple OK) */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{alertTitle || "Notice"}</DialogTitle>
            <DialogDescription>{alertMessage}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button
              variant="blue"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog (Cancel / Confirm) */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmTitle || "Confirm"}</DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                handleConfirm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleConfirm(true);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

export default NotificationContext;
