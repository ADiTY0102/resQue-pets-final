import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Fundraising = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");

  // Mock data
  const metrics = {
    total_funds: 50000,
    total_pets_adopted: 42,
    total_pets_donated: 18,
  };

  const transactions = [
    {
      id: '1',
      donor_name: 'John Doe',
      amount: 5000,
      transaction_time: new Date().toISOString(),
    },
    {
      id: '2',
      donor_name: 'Jane Smith',
      amount: 10000,
      transaction_time: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      donor_name: 'Mike Johnson',
      amount: 3500,
      transaction_time: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const totalFunds = Number(metrics?.total_funds || 0);
  const fundGoal = 100000;
  const progressPercentage = Math.min((totalFunds / fundGoal) * 100, 100);

  const handleDonateClick = () => {
    if (!donorName || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Donation Successful",
      description: `Thank you ${donorName} for your donation of ₹${amount}!`,
    });
    
    setIsOpen(false);
    setDonorName("");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-6xl mx-auto text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Help Us Save More Lives
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Every contribution makes a difference in giving pets a second chance at life
          </p>
        </div>
      </section>

      {/* Fundraising Stats */}
      <section className="py-8 sm:py-10 lg:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Fundraising Progress</CardTitle>
              <CardDescription className="text-sm sm:text-base">Help us reach our goal to care for more animals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-semibold">₹{totalFunds.toLocaleString()}</span>
                </div>
                <Progress value={progressPercentage} className="h-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal: ₹{fundGoal.toLocaleString()}</span>
                  <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                </div>
              </div>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full text-lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Make a Donation</DialogTitle>
                    <DialogDescription>
                      Your contribution helps us care for animals in need
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="donor_name">Your Name</Label>
                      <Input
                        id="donor_name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <Button onClick={handleDonateClick} className="w-full">
                      Proceed to Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader>
                <Heart className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Pets Adopted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{metrics?.total_pets_adopted || 0}</p>
                <p className="text-sm text-muted-foreground">Lives changed forever</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-secondary mb-2" />
                <CardTitle>Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">₹{totalFunds.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Funds raised to date</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Pets Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{metrics?.total_pets_donated || 0}</p>
                <p className="text-sm text-muted-foreground">Pets waiting for homes</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          {transactions && transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Contributions</CardTitle>
                <CardDescription>Thank you to our generous donors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{transaction.donor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.transaction_time).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        ₹{Number(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Fundraising;
