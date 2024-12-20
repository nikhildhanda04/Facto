import { useEffect, useState } from "react";
import { CalendarIcon, Check } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { User } from "@/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useGlobalContext } from "@/context/GlobalContext";



const states = ["Andhra Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu"];

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    aadharNumber: "",
    panNumber: "",
    dateOfBirth: "",
    gender: "",
    address: {
      houseNumber: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    gstNumber: "",
    avatar: "/assets/user.png",
  });

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
    phoneNumber: "",
    aadharNumber: "",
    panNumber: "",
    gender: "",
    gstNumber: "",
    dateOfBirth: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    phoneNumber: "",
    aadharNumber: "",
    panNumber: "",
    gstNumber: "",
  });

  // Access the logout function and other context values
  const { logout } = useGlobalContext();

  const validateField = (name: string, value: string) => {
    let error = "";
    if (value?.length > 0) {
      switch (name) {
        case "phone":
          error =
            value?.length !== 10
              ? "Phone number must be exactly 10 digits"
              : "";
          break;
        case "aadhar":
          error =
            value?.length !== 12
              ? "Aadhar number must be exactly 12 digits"
              : "";
          break;
        case "pan":
          error =
            value?.length !== 10
              ? "PAN number must be exactly 10 characters"
              : "";
          break;
        case "gst":
          error =
            value?.length !== 15
              ? "GST number must be exactly 15 characters"
              : "";
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (
        ["phoneNumber", "aadharNumber", "panNumber", "gstNumber"].includes(name)
      ) {
        validateField(name, value);
      }
    }
  };

  const getData = async () => {
    try {
      const response = await User.getDetails();
      console.log("Login Successful:", response);
      setUser(response?.data?.user);
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleSubmit = async () => {
    const isValid = [
      "phoneNumber",
      "aadharNumber",
      "panNumber",
      "gstNumber",
    ].every((field) =>
      validateField(field, formData[field as keyof typeof formData] as string)
    );
    if (isValid) {
      console.log("Saving data:", formData);
      setIsEditing(false);
    } else {
      console.log("Form has errors, please correct them before submitting");
    }

    console.log(formData);
    try {
      const response = await User.addDetails(formData);
      console.log("Your Details are saved Successfully:", response);
      await getData();
    } catch (error) {
      console.error("Signup Failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card className="w-full max-w-[1282px] mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-7">
        <div className="flex items-center space-x-4">
          <img
            alt="Profile picture"
            className="rounded-full"
            height="100"
            src={formData.avatar}
            style={{
              aspectRatio: "100/100",
              objectFit: "cover",
            }}
            width="100"
          />
          <div>
            <h2 className="text-2xl font-bold">{formData.fullName}</h2>
            <p className="text-muted-foreground">{formData.email}</p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" />
            Done
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="fullName"
                value={formData?.fullName || user?.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Your Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phoneNumber"
                value={formData.phoneNumber || user?.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="91 xxxxx xxxxx"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">Pan Number</Label>
              <Input
                id="pan"
                name="panNumber"
                value={formData.panNumber || user?.panNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="PAN XXX XXXX"
              />
              {errors.panNumber && (
                <p className="text-sm text-red-500">{errors.panNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                disabled={!isEditing}
                value={formData.gender || user?.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number (If Any)</Label>
              <Input
                id="gst"
                name="gstNumber"
                value={formData.gstNumber || user?.gstNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="22AAAAA0000A1Z5"
              />
              {errors.gstNumber && (
                <p className="text-sm text-red-500">{errors.gstNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || user?.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="example@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                name="aadharNumber"
                value={formData.aadharNumber || user?.aadharNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="XXXX XXXX XXXX"
              />
              {errors.aadharNumber && (
                <p className="text-sm text-red-500">{errors.aadharNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground"
                    )}
                    disabled={!isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth
                      ? format(formData.dateOfBirth, "PPP")
                      : user?.dateOfBirth
                      ? format(formData.dateOfBirth, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                <Calendar
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                  onSelect={(date: Date | undefined) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateOfBirth: date ? date.toISOString() : "", 
                    }))
                  }
                />

                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                name="address.houseNumber"
                value={formData.address.houseNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="House Number"
              />
              <Input
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Street"
              />
              <Input
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="City"
              />
              <Select
                name="address.state"
                disabled={!isEditing}
                value={formData.address.state}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Pincode"
              />
            </div>
          </div>
        </div>

        {/* Log Out Button */}

        <Button variant="destructive" className="mt-4 w-full" onClick={logout}>
          Log Out
        </Button>
      </CardContent>
    </Card>
  );
}
