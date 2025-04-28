"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, Clock, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Symptom } from "@/lib/types"
import { deleteSymptom } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface RecentSymptomsProps {
  symptoms: Symptom[]
}

export default function RecentSymptoms({ symptoms }: RecentSymptomsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)

  const handleDeleteClick = (symptom: Symptom) => {
    setSelectedSymptom(symptom)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedSymptom) {
      deleteSymptom(selectedSymptom.id)
      toast({
        title: "Symptom deleted",
        description: "The symptom record has been removed",
      })
      setDeleteDialogOpen(false)
    }
  }

  const sortedSymptoms = [...symptoms].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <>
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Symptoms</CardTitle>
          <CardDescription>Your latest logged symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSymptoms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No symptoms logged yet.</p>
              <p className="text-sm mt-2">Add your first symptom using the "Log Symptom" button.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSymptoms.slice(0, 5).map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Avatar className="h-9 w-9 border-0 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <AvatarFallback>
                      {symptom.type ? symptom.type.charAt(0).toUpperCase() : "S"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{symptom.type || "Symptom"}</div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            symptom.intensity > 6 ? "destructive" : symptom.intensity > 3 ? "default" : "outline"
                          }
                        >
                          Intensity: {symptom.intensity}/10
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(symptom)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="text-sm text-slate-500 flex items-center space-x-4">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(symptom.timestamp).toLocaleDateString()}
                      </span>
                      {symptom.duration && symptom.durationUnit && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {symptom.duration} {symptom.durationUnit}
                        </span>
                      )}
                    </div>

                    {symptom.triggers && (
                      <div className="text-sm">
                        <span className="text-slate-700 font-medium">Triggers:</span> {symptom.triggers}
                      </div>
                    )}

                    {symptom.notes && <div className="text-sm text-slate-600 mt-1">{symptom.notes}</div>}
                  </div>
                </div>
              ))}

              {sortedSymptoms.length > 5 && (
                <div className="text-center pt-2">
                  <Link href="/history">
                    <Button variant="outline">View All Symptoms</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Symptom</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this symptom? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
