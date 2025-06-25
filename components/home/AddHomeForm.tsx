"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { Home } from "@prisma/client";
import { toast } from "sonner";
import { XCircle, PencilLine, CalendarIcon, Trash, Eye } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import useLocation from "@/hooks/useLocation";
import { useEffect } from "react";
import axios from "axios";
import { ICity, IState } from "country-state-city";
import { useRouter } from "next/navigation";

// Fixed: Make home optional for creating new homes
interface HomeFormProps {
  home: Home | null;
}

const PropertyTypeEnum = z.enum([
  "HOUSE",
  "APARTMENT",
  "CONDO",
  "TOWNHOUSE",
  "CABIN",
]);

const HomeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  pricePerNight: z
    .number()
    .positive({ message: "Price per night must be greater than 0" }),
  bedrooms: z
    .number()
    .int()
    .min(1, { message: "At least one bedroom is required" }),
  bathrooms: z.number().min(0, { message: "Bathrooms cannot be negative" }),
  propertyType: PropertyTypeEnum, // Use the enum
  maxGuests: z
    .number()
    .int()
    .min(1, { message: "Max guests must be at least 1" }),
  availableFrom: z.date(),
  availableTo: z.date().optional(),
  hostId: z.string(),
  hasWifi: z.boolean(),
  hasKitchen: z.boolean(),
  hasLaundry: z.boolean(),
  hasParking: z.boolean(),
  hasAirConditioning: z.boolean(),
  hasHeating: z.boolean(),
  hasPool: z.boolean(),
  hasGym: z.boolean(),
  petsAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  image: z.string(), // Use the HomeImageSchema
  country: z.string(),
  state: z.string(),
  city: z.string(),
});

// Create form type from the schema
export type HomeFormData = z.infer<typeof HomeSchema>;

const AddHotelForm = ({ home }: HomeFormProps) => {
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const countries = getAllCountries();

  const form = useForm<HomeFormData>({
    resolver: zodResolver(HomeSchema),
    defaultValues: {
      id: home?.id || undefined,
      title: home?.title || "",
      description: home?.description || "",
      address: home?.address || "",
      pricePerNight: home?.pricePerNight ? Number(home.pricePerNight) : 0,
      bedrooms: home?.bedrooms || 1,
      bathrooms: home?.bathrooms || 1,
      propertyType: home?.propertyType || "HOUSE",
      maxGuests: home?.maxGuests || 1,
      availableFrom: home?.availableFrom || new Date(),
      availableTo: home?.availableTo || undefined,
      hostId: home?.hostId || "",
      hasWifi: home?.hasWifi ?? false,
      hasKitchen: home?.hasKitchen ?? false,
      hasLaundry: home?.hasLaundry ?? false,
      hasParking: home?.hasParking ?? false,
      hasAirConditioning: home?.hasAirConditioning ?? false,
      hasHeating: home?.hasHeating ?? false,
      hasPool: home?.hasPool ?? false,
      hasGym: home?.hasGym ?? false,
      petsAllowed: home?.petsAllowed ?? false,
      smokingAllowed: home?.smokingAllowed ?? false,
      // Use images directly, ensuring order and isPrimary have default values
      image: home?.image || "",
      country: home?.country || "",
      state: home?.state || "",
      city: home?.city || "",
    },
  });
  const image = form.watch("image"); // Get current image value
  function handleImageDelete(image: string) {
    const key = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { key })
      .then((res) => {
        if (res.data.success) {
          form.setValue("image", "");
          toast("Image removed");
        }
      })
      .catch(() => {
        toast("Something went wrong");
      });
  }

  const router = useRouter();

  const selectedCountry = form.watch("country");
  const selectedState = form.watch("state");

  const handleDeleteHome = async (home: Home) => {
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);

    try {
      const imageKey = getImageKey(home.image);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/home/${home.id}`);
      toast("Home Created");
      router.push("/home/new");
    } catch (error: any) {
      toast("Home couldn't be Deleted");
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [selectedCountry, selectedState]);

  function onSubmit(values: z.infer<typeof HomeSchema>) {
    if (home) {
      // update
      axios
        .patch(`/api/home/${home.id}`, values)
        .then((res) => {
          toast("Hotel Updated");
          router.push(`/home/${res.data.id}`);
        })
        .catch((err) => {
          console.log(err);
          toast("Something went wrong");
        });
    } else {
      axios
        .post("/api/home", values)
        .then((res) => {
          toast("Home Created");
          console.log(res);
          router.push(`/home/${res.data.id}`);
        })
        .catch((err) => {
          console.log(err);
          toast("Something went wrong");
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title and Description Row */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Beautiful Lakeside Cabin" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide an attractive name for your property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property, amenities, and what makes it special..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell guests what makes your property unique
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main Street, City, State, ZIP"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Full address of your property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Country</FormLabel>
                    <FormDescription>
                      In which country is your property?
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder="Select a Country"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => {
                          return (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select State</FormLabel>
                    <FormDescription>
                      In which state is your property?
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                      disabled={states.length < 1}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder="Select a State"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => {
                          return (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
                              {state.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select City</FormLabel>
                  <FormDescription>
                    In which city is your property?
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={cities.length < 1}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        placeholder="Select a City"
                        defaultValue={field.value}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => {
                        return (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Property Type and Price Row */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOUSE">House</SelectItem>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="CONDO">Condo</SelectItem>
                      <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                      <SelectItem value="CABIN">Cabin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What type of property is this?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="pricePerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Night ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="150.00"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? undefined : value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Set your nightly rate in USD
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Max Guests Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="2"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || "")
                    }
                  />
                </FormControl>
                <FormDescription>Number of bedrooms</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="1.5"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || "")
                    }
                  />
                </FormControl>
                <FormDescription>Number of bathrooms</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="4"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || "")
                    }
                  />
                </FormControl>
                <FormDescription>Maximum occupancy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Availability Dates */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Available From</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When is your property first available?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="availableTo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Available Until (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick end date (optional)</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() ||
                          (form.getValues("availableFrom") &&
                            date <= form.getValues("availableFrom"))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Leave empty if available indefinitely
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amenities Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Amenities & Features</h3>
            <p className="text-sm text-muted-foreground">
              Select all amenities available at your property
            </p>
          </div>

          {/* Essential Amenities */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Essential
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hasWifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>WiFi</FormLabel>
                      <FormDescription>
                        High-speed internet access
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasKitchen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Kitchen</FormLabel>
                      <FormDescription>Full kitchen facilities</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasHeating"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Heating</FormLabel>
                      <FormDescription>Central or room heating</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Comfort Amenities */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Comfort
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hasAirConditioning"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Air Conditioning</FormLabel>
                      <FormDescription>Climate control system</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasLaundry"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Laundry</FormLabel>
                      <FormDescription>
                        Washer and dryer available
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasParking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Parking</FormLabel>
                      <FormDescription>Dedicated parking space</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Entertainment Amenities */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Entertainment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hasPool"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pool</FormLabel>
                      <FormDescription>Swimming pool access</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasGym"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Gym/Fitness</FormLabel>
                      <FormDescription>Fitness facilities</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Policies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="petsAllowed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pets Allowed</FormLabel>
                      <FormDescription>Pet-friendly property</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smokingAllowed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Smoking Allowed</FormLabel>
                      <FormDescription>Smoking permitted</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormLabel>Upload Image</FormLabel>
                <FormDescription>
                  Choose an image that will show your Property nicely
                </FormDescription>
                <FormControl>
                  {image ? (
                    <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                      <Image
                        fill
                        src={image}
                        alt="Home Image"
                        className="object-contain"
                      />
                      <Button
                        onClick={() => handleImageDelete(image)}
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-[-12px] top-0"
                      >
                        <XCircle />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w[4000px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          form.setValue("image", res[0].ufsUrl);
                          toast("Image is uploaded");
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                    </div>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2 flex-wrap">
            {home && (
              <Button
                type="button"
                className="max-w-[150px]"
                onClick={() => handleDeleteHome(home)}
                variant="ghost"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
            {home && (
              <Button
                variant="outline"
                onClick={() => router.push(`/home/${home.id}`)}
                type="button"
                className="max-w-[150px]"
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Button>
            )}
            {home ? (
              <Button type="submit" className="max-w-[150px]">
                <PencilLine className="mr-2 h-4 w-4" /> Update
              </Button>
            ) : (
              <Button type="submit" className="max-w-[150px]">
                <PencilLine className="mr-2 h-4 w-4" /> Create
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddHotelForm;

// For Later
// const BookingStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);

// const BookingSchema = z
//   .object({
//     id: z.string().uuid(),
//     homeId: z.string().uuid().optional(),
//     userId: z.string().min(1).optional(),
//     startDate: z.coerce.date({ invalid_type_error: "Invalid start date" }),
//     endDate: z.coerce.date({ invalid_type_error: "Invalid end date" }),
//     totalPrice: z.coerce
//       .number({ invalid_type_error: "Total price must be a number" })
//       .nonnegative({ message: "Total price cannot be negative" }),
//     status: BookingStatusEnum,
//     createdAt: z.coerce.date().optional(),
//     updatedAt: z.coerce.date().optional(),
//   })
//   .refine((data) => data.endDate > data.startDate, {
//     message: "endDate must be after startDate",
//     path: ["endDate"],
//   });
