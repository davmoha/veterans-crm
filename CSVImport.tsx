import { DashboardLayout } from "./DashboardLayout";
import { trpc } from "./trpc";
import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: number; details: string[] } | null>(null);
  const utils = trpc.useUtils();
  const createMutation = trpc.constituents.create.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file must have headers and at least one data row");
        setImporting(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredFields = ['firstname', 'lastname'];
      const hasRequired = requiredFields.every(field => headers.includes(field));

      if (!hasRequired) {
        toast.error("CSV must have 'First Name' and 'Last Name' columns");
        setImporting(false);
        return;
      }

      let success = 0;
      let errors = 0;
      const details: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        try {
          const contactTypes = (row.contacttypes || row['contact types'] || '')
            .split(',')
            .map(t => t.trim())
            .filter(t => ['Volunteer', 'Board', 'Member', 'Donor'].includes(t));

          await createMutation.mutateAsync({
            firstName: row.firstname || '',
            lastName: row.lastname || '',
            primaryEmail: row.email || row.primaryemail || '',
            primaryPhone: row.phone || row.primaryphone || '',
            addressStreet1: row.street1 || row.street || row.address || '',
            addressStreet2: row.street2 || '',
            addressCity: row.city || '',
            addressState: row.state || '',
            addressZip: row.zip || row.zipcode || '',
            addressCountry: row.country || '',
            employerName: row.employer || row.employername || '',
            jobTitle: row.jobtitle || row['job title'] || '',
            contactTypes: contactTypes.length > 0 ? contactTypes : ['Member'],
            contactNotes: row.notes || row.comments || '',
            optInEmail: row.optinemail !== 'false' && row.optinemail !== '0',
            optInSms: row.optinsms === 'true' || row.optinsms === '1',
            optInPhysicalMail: row.optinphysicalmail !== 'false' && row.optinphysicalmail !== '0',
          });
          success++;
        } catch (error) {
          errors++;
          details.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setResults({ success, errors, details });
      utils.constituents.list.invalidate();
      utils.constituents.stats.invalidate();
      
      if (errors === 0) {
        toast.success(`Successfully imported ${success} constituents`);
      } else {
        toast.warning(`Imported ${success} constituents with ${errors} errors`);
      }
    } catch (error) {
      toast.error("Failed to import CSV: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImporting(false);
      setFile(null);
    }
  };

  const downloadTemplate = () => {
    const template = `First Name,Last Name,Email,Phone,Street,City,State,ZIP,Employer,Job Title,Contact Types,Notes
John,Doe,john@example.com,555-0100,123 Main St,Springfield,IL,62701,Acme Corp,Manager,Volunteer,Interested in mentoring
Jane,Smith,jane@example.com,555-0101,456 Oak Ave,Springfield,IL,62702,Tech Inc,Director,Board,Board member candidate`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'constituent_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Import Constituents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bulk import volunteers, sponsors, and members from a CSV file (e.g., from conference registrations)
          </p>
        </div>

        {/* Instructions */}
        <Card className="p-6 border-border">
          <h2 className="font-semibold text-foreground mb-3">How to Import</h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Prepare a CSV file with columns: First Name, Last Name, Email, Phone, etc.</li>
            <li>Download our template to see the expected format</li>
            <li>Fill in your constituent data</li>
            <li>Upload the file below</li>
            <li>Review the import results</li>
          </ol>
          <Button onClick={downloadTemplate} variant="outline" className="mt-4 gap-2">
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </Card>

        {/* Upload Area */}
        <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-foreground">Upload CSV File</p>
              <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
              className="hidden"
              id="csv-input"
            />
            <label htmlFor="csv-input" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">
              Select File
            </label>
            {file && <p className="text-sm text-primary">{file.name}</p>}
          </div>
        </Card>

        {/* Import Button */}
        {file && (
          <Button onClick={handleImport} disabled={importing} className="w-full gap-2">
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {file.name}
              </>
            )}
          </Button>
        )}

        {/* Results */}
        {results && (
          <Card className={`p-6 border-l-4 ${results.errors === 0 ? 'border-l-emerald-500 bg-emerald-500/5' : 'border-l-amber-500 bg-amber-500/5'}`}>
            <div className="flex gap-3">
              {results.errors === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {results.success} constituent{results.success !== 1 ? 's' : ''} imported successfully
                </p>
                {results.errors > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.errors} error{results.errors !== 1 ? 's' : ''} encountered
                  </p>
                )}
                {results.details.length > 0 && (
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {results.details.slice(0, 5).map((detail, i) => (
                      <p key={i}>{detail}</p>
                    ))}
                    {results.details.length > 5 && (
                      <p className="text-xs">... and {results.details.length - 5} more errors</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
